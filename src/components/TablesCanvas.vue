<script setup lang="ts">
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import CanvasMenu from './canvas/CanvasMenu.vue'
import CanvasActionBar from './canvas/CanvasActionBar.vue'
import type { Person } from '@/composables/usePeople'
import type { CanvasTable, ContextMenu } from './canvas/types'
import PersonComponent from '@/components/Person.vue'
import useTableGeometry from '@/composables/useTableGeometry'
import { useSize, useView } from '@/composables/useCanvas'

const { generateSeatingGrid, offsetUserCardCoordinates } = useTableGeometry()

const props = defineProps<{
  people: Person[]
  tables: CanvasTable[]
}>()

const emit = defineEmits<{
  (e: 'addCircleTable'): void
  (e: 'addRectTable'): void
  (e: 'deleteTable', table: CanvasTable): void
  (e: 'addPersonToTable', table: CanvasTable, person: Person): void
  (
    e: 'updateTableCoordinates',
    table: CanvasTable,
    coordinates: { x: CanvasTable['x']; y: CanvasTable['y'] },
  ): void
}>()

const stageRef = ref()
const containerRef = ref()

const selectedId = ref<CanvasTable['id']>()
const hoverId = ref<CanvasTable['id']>()

const contextMenu = ref<ContextMenu>({
  visible: false,
})

const baseTableStyle = {
  fill: '#ffffff',
  stroke: '#CBD5E1',
  strokeWidth: 1.5,
  shadowColor: 'rgba(0,0,0,0.08)',
  shadowBlur: 10,
  shadowOffsetY: 4,
  cornerRadius: 10,
}

function onRightClick(e: any, table: CanvasTable) {
  e.evt.preventDefault()

  const stage = e.target.getStage()
  const pos = stage.getPointerPosition()

  contextMenu.value = {
    visible: true,
    x: pos.x,
    y: pos.y,
    table,
  }
}

function getDragOverShape(e: any) {
  const stage = stageRef.value.getStage()

  const rect = stage.container().getBoundingClientRect()

  const pointerPosition = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }

  return stage.getIntersection(pointerPosition)
}

function onDrop(e: any) {
  const shape = getDragOverShape(e)
  const person_id = e.dataTransfer.getData('person_id')
  const person = props.people.find((p) => p.id == person_id)
  const table = shape?.attrs.table

  if (table && person) {
    emit('addPersonToTable', table, person)
  }
}

function onDragOver(e: any) {
  const shape = getDragOverShape(e)
  handleHover(shape?.attrs.table)
}

function handleHover(table?: CanvasTable) {
  if (table?.id) {
    hoverId.value = table.id
  } else {
    hoverId.value = undefined
  }
}

const tablesWithCoordinates = computed(() => {
  const card_width = 150
  const card_height = 30

  return props.tables.map((t) => {
    const seating = generateSeatingGrid(t, (card_height * 3) / 4, card_height)

    return {
      ...t,
      seating,
      people: t.people.map((p, index) => {
        const seat = seating.seats[index]!
        const card = offsetUserCardCoordinates(seat, t, card_width, card_height)

        return {
          ...p,
          label: index + 1 + '. ' + p.name, // + '\n ' + `${seat.x.toFixed(2)} _ ${seat.y.toFixed(2)}`,
          seat,
          card: {
            ...card,
            height: card_height,
            width: card_width,
          },
        }
      }),
    }
  })
})

function onPersonDragStart(e: any, person: Person) {
  e.dataTransfer.setData('person_id', person.id)
}

function onTableDragMove(e: any, table: CanvasTable) {
  const node = e.target
  emit('updateTableCoordinates', table, {
    x: node.x(),
    y: node.y(),
  })
}
const sizeRef = ref()
const { sizeConfig } = useSize(sizeRef)
const { viewConfig, onWheel, resetView, onMouseDown, onMouseMove, onMouseUp, isPanning } =
  useView(stageRef)
</script>

<template>
  <div
    @dragover.prevent="onDragOver"
    ref="containerRef"
    @drop="onDrop"
    class="relative w-full h-full border border-amber-600 overflow-hidden"
    :class="{ 'cursor-grab active:cursor-grabbing': isPanning }"
  >
    <div ref="sizeRef" class="absolute inset-0 pointer-events-none" />
    <v-stage
      ref="stageRef"
      v-if="sizeConfig.width > 0 && sizeConfig.height > 0"
      :config="{ ...sizeConfig, ...viewConfig }"
      @wheel="onWheel"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
    >
      <v-layer>
        <v-group
          v-for="table in tablesWithCoordinates.filter((t) => t.type === 'circle')"
          :key="table.id"
          :config="{
            table: table,
            onClick: () => (selectedId = table.id),
            onMouseEnter: () => handleHover(table),
            onMouseLeave: () => handleHover(),
            onContextMenu: (e: any) => onRightClick(e, table),
          }"
        >
          <v-circle
            :config="{
              table: table,
              x: table.x,
              y: table.y,
              radius: table.width / 2,
              fill: baseTableStyle.fill,
              stroke: baseTableStyle.stroke,
              strokeWidth: 1.5,
              shadowBlur: hoverId === table.id ? 14 : 8,
              shadowOpacity: 0.1,
              draggable: true,
            }"
            @dragmove="onTableDragMove($event, table)"
          />

          <v-text
            :config="{
              text: `${table.name}\n Count: ${table.people.length}`,
              x: table.x - table.width / 2,
              y: table.y - 10,
              width: table.width,
              align: 'center',
              fontSize: 15,
              fill: '#334155',
              listening: false, // 👈 KEY FIX
            }"
          />

          <v-group
            v-for="(person, index) in table.people"
            :key="person.id"
            :config="{
              x: person.card.x,
              y: person.card.y,
            }"
          >
            <v-rect
              :config="{
                width: person.card.width,
                height: person.card.height,
                fill: 'white',
                stroke: '#e2e8f0',
                cornerRadius: 6,
                shadowBlur: 10,
                shadowOpacity: 0.2,
              }"
            />
            <v-text
              :config="{
                text: person.label,
                fontSize: 12,
                fill: '#334155',
                width: person.card.width,
                height: person.card.height,
                align: 'center',
                verticalAlign: 'middle',
              }"
            />
          </v-group>

          <v-group
            v-if="false"
            :config="{
              listening: false,
            }"
          >
            <v-circle
              :config="{
                ...table.seating.ring,
                stroke: 'rgba(0,0,0,0.05)',
                strokeWidth: 1,
                fill: 'transparent',
              }"
            />
            <v-circle
              v-for="(dot, i) in table.seating.seats"
              :key="i"
              :config="{
                ...dot,
                radius: 1,
                fill: 'rgba(255, 0, 0, 0.5)',
              }"
            />
          </v-group>
        </v-group>

        <!-- <v-group
          v-for="table in tablesWithCoordinates.filter((t) => t.type === 'rect')"
          :key="table.id"
          :config="{
            table: table,
            draggable: true,
            onClick: () => (selectedId = table.id),
            onMouseEnter: () => handleHover(table),
            onMouseLeave: () => handleHover(),
            onContextMenu: (e: any) => onRightClick(e, table),
          }"
        >
          <v-rect
            :config="{
              table: table,
              x: table.x,
              y: table.y,
              width: table.width,
              height: table.height,
              fill: baseTableStyle.fill,
              stroke: selectedId === table.id ? '#3B82F6' : baseTableStyle.stroke,
              strokeWidth: 1.5,
              cornerRadius: 14,
              shadowBlur: hoverId === table.id ? 50 : 8,
              shadowOpacity: 0.1,
              shadowOffsetY: 3,
            }"
          />

          <v-text
            :config="{
              table: table,
              text: table.name,
              x: table.x,
              y: table.y,
              width: table.width,
              height: table.height,
              align: 'center',
              verticalAlign: 'middle',
              fontSize: 13,
              fill: '#334155',
              listening: false,
            }"
          />
        </v-group> -->
      </v-layer>
    </v-stage>

    <CanvasMenu
      v-model:open="contextMenu.visible"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :table="contextMenu.table"
      @delete="$emit('deleteTable', $event)"
    />

    <CanvasActionBar
      @createCircleTable="$emit('addCircleTable')"
      @createRectTable="$emit('addRectTable')"
      @focusContent="resetView()"
    />
  </div>
</template>

<style></style>
