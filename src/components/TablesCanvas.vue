<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Circle } from 'lucide-vue-next'
import { Square } from '@lucide/vue'

import CanvasMenu from './canvas/CanvasMenu.vue'
import CanvasActionBar from './canvas/CanvasActionBar.vue'
import type { Person } from '@/composables/usePeople'
import { P } from 'vue-router/dist/index-D_VEAp3P.js'
import type { Table } from '@/composables/useTables'

const props = defineProps<{
  people: Person[]
}>()

export type CanvasTable =
  | {
      id: string | number
      type: 'circle'
      x: number
      y: number
      radius: number
      name: string
      people: Person[]
    }
  | {
      id: string | number
      type: 'rect'
      x: number
      y: number
      width: number
      height: number
      name: string
      people: Person[]
    }

const stageRef = ref()
const containerRef = ref()
const containerSize = ref<{
  width: number
  height: number
}>()

onMounted(() => {
  //  const el = val.getStage().attrs.container
  const el = containerRef.value
  const rect = el.getBoundingClientRect()

  containerSize.value = {
    width: rect.width,
    height: rect.height,
  }
})

function handleWheel(e: any) {
  e.evt.preventDefault()

  const stage = e.target.getStage()
  const oldScale = stage.scaleX()

  const pointer = stage.getPointerPosition()

  const scaleBy = 1.05
  const direction = e.evt.deltaY > 0 ? -1 : 1

  const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy

  stage.scale({ x: newScale, y: newScale })

  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  }

  const newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  }

  stage.position(newPos)
  stage.batchDraw()
}

function addCircleTable() {
  tables.value.push({
    id: String(tables.value.length + 1),
    type: 'circle',
    x: 200,
    y: 200,
    radius: 100,
    name: `Table ${tables.value.length + 1}`,
    people: [],
  })
}

function addRectTable() {
  tables.value.push({
    id: String(tables.value.length + 1),
    type: 'rect',
    x: 200,
    y: 200,
    width: 200,
    height: 100,
    name: `Table ${tables.value.length + 1}`,
    people: [],
  })
}

const selectedId = ref()
const hoverId = ref()

const tables = ref<CanvasTable[]>([
  {
    id: 1,
    type: 'circle',
    x: 200,
    y: 200,
    radius: 100,
    name: `Table 1`,
    people: [],
  },
])

const baseTableStyle = {
  fill: '#ffffff',
  stroke: '#CBD5E1',
  strokeWidth: 1.5,
  shadowColor: 'rgba(0,0,0,0.08)',
  shadowBlur: 10,
  shadowOffsetY: 4,
  cornerRadius: 10,
}

function deleteSelectedTable(table: CanvasTable) {
  tables.value = tables.value.filter((t) => t.id !== table.id)
  selectedId.value = null
}

const contextMenu = ref<{
  visible: boolean
  x?: number
  y?: number
  table?: CanvasTable
}>({
  visible: false,
})

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

function getHoveredShape(e: any) {
  const stage = stageRef.value.getStage()

  const rect = stage.container().getBoundingClientRect()

  const pointerPosition = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }

  return stage.getIntersection(pointerPosition)
}

function onDrop(e: any) {
  const shape = getHoveredShape(e)
  const person_id = e.dataTransfer.getData('person')
  const person = props.people.find((p) => p.id == person_id)
  const table = shape?.attrs.table

  if (table && person) {
    assignPersonToTable(person, table)
  }
}

function onDragOver(e: any) {
  const shape = getHoveredShape(e)
  handleHover(shape?.attrs.table)
}

function handleHover(table?: CanvasTable) {
  if (table?.id) {
    hoverId.value = table.id
  } else {
    hoverId.value = null
  }
}

function assignPersonToTable(person: Person, table: Table) {
  // remove from previous table first
  tables.value = tables.value.map((t) => {
    if (t.id == table.id) {
      return {
        ...t,
        people: [...t.people.filter((p) => p.id !== person.id), person],
      }
    } else {
      return {
        ...t,
        people: [...t.people.filter((p) => p.id !== person.id)],
      }
    }
  })
}

function getSeatPosition(table: CanvasTable, index: number) {
  if (table.type != 'circle') {
    return
  }
  const n = table.people.length

  const angle = (index / n) * Math.PI * 2 - Math.PI / 2

  return {
    x: table.x + Math.cos(angle) * table.radius,
    y: table.y + Math.sin(angle) * table.radius,
  }
}

function layoutTable(table: CanvasTable) {
  table.people.forEach((person, index) => {
    const pos = getSeatPosition(table, index)
    person.x = pos.x
    person.y = pos.y
  })
}

watch(tables, (val) => {
  console.log(val)
})
</script>

<template>
  <div
    ref="containerRef"
    @dragover.prevent="onDragOver"
    @drop="onDrop"
    class="relative w-full h-full cursor-grab active:cursor-grabbing"
  >
    <v-stage
      v-if="containerSize && containerSize?.width > 0"
      ref="stageRef"
      class="h-full w-full"
      :config="{ ...containerSize, draggable: true }"
      @wheel="handleWheel"
    >
      <v-layer>
        <v-group
          v-for="table in tables.filter((t) => t.type === 'circle')"
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
          <v-circle
            :config="{
              table: table,
              x: table.x,
              y: table.y,
              radius: table.radius,
              fill: baseTableStyle.fill,
              stroke: selectedId === table.id ? '#3B82F6' : baseTableStyle.stroke,
              strokeWidth: 1.5,
              shadowBlur: hoverId === table.id ? 50 : 8,
              shadowOpacity: 0.1,
            }"
          />

          <v-text
            :config="{
              table: table,
              text: table.name,
              x: table.x - table.radius,
              y: table.y - 10,
              width: table.radius * 2,
              align: 'center',
              fontSize: 13,
              fill: '#334155',
            }"
          />

          <v-text
            v-for="(person, index) in table.people"
            :config="{
              x: getSeatPosition(table, index)?.x,
              y: getSeatPosition(table, index)?.y,
              text: person.name,
              draggable: true,
            }"
          />
        </v-group>

        <v-group
          v-for="table in tables.filter((t) => t.type === 'rect')"
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
          <!-- Table body -->
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

          <!-- name (centered) -->
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
        </v-group>
      </v-layer>
    </v-stage>

    <CanvasMenu
      v-model:open="contextMenu.visible"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :table="contextMenu.table"
      @delete="deleteSelectedTable"
    />

    <CanvasActionBar @createCircleTable="addCircleTable" @createRectTable="addRectTable" />
  </div>
</template>

<style></style>
