<script setup lang="ts">
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import CanvasMenu from './canvas/CanvasMenu.vue'
import CanvasActionBar from './canvas/CanvasActionBar.vue'
import type { Person } from '@/composables/usePeople'
import type { CanvasTable, ContextMenu } from './canvas/types'
import PersonComponent from '@/components/Person.vue'
import useTableGeometry from '@/composables/useTableGeometry'
import { useSize, useView } from '@/composables/useCanvas'
import { useCreateTablesActions } from '@/composables/useCreateTablesActions'
import CircleTable from './canvas/CircleTable.vue'
import RectTable from './canvas/RectTable.vue'

const props = defineProps<{
  people: Person[]
  tables: CanvasTable[]
}>()

const emit = defineEmits<{
  (e: 'addCircleTable', coordinates: { x: number; y: number }): void
  (e: 'addRectTable', coordinates: { x: number; y: number }): void
  (e: 'deleteTable', table: CanvasTable): void
  (e: 'addPersonToTable', table: CanvasTable, person: Person): void
  (
    e: 'updateTableCoordinates',
    table: CanvasTable,
    coordinates: { x: CanvasTable['x']; y: CanvasTable['y'] },
    save: boolean,
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

function onPersonDragStart(e: any, person: Person) {
  e.dataTransfer.setData('person_id', person.id)
}

/**
 *
 * NEW CLEAN CODE
 *
 */
const sizeRef = ref()
const { sizeConfig } = useSize(sizeRef)
const { viewConfig, onWheel, resetView, onMouseDown, onMouseMove, onMouseUp, isPanning } =
  useView(stageRef)

const { placementMode, onCreateCircle, onCreateRect, onPlaceNewTable } = useCreateTablesActions({
  stageRef,
  viewConfig,
  addCircleTable: (coordinates) => emit('addCircleTable', coordinates),
  addRectTable: (coordinates) => emit('addRectTable', coordinates),
})

const tableConfig = (table: CanvasTable) => {
  return {
    table: table,
    onClick: () => (selectedId.value = table.id),
    onMouseEnter: () => handleHover(table),
    onMouseLeave: () => handleHover(),
    onContextMenu: (e: any) => onRightClick(e, table),
  }
}

// const onTableDrag = (e: any, table: CanvasTable, save: boolean = false) => {
//   const node = e.target
//   const coordinates = { x: node.x(), y: node.y() }
//   emit('updateTableCoordinates', table, coordinates, save)
// }

const onTableDragEnd = (e) => {
  // e.target.clearCache()

  const id = e.target.attrs?.table?.id
  const table = props.tables?.find((t) => t.id === id)
  const tableNode = e.target.getChildren?.()?.find((d) => d.attrs.isTable)

  if (tableNode && table) {
    let pos = {
      x: e.target.x() + tableNode.x(),
      y: e.target.y() + tableNode.y(),
    }

    e.target.x(0)
    e.target.y(0)

    emit('updateTableCoordinates', table, pos, true)
  }
}

const onDragStart = (e) => {
  // e.target.cache({ pixelRatio: window.devicePixelRatio * 5 })
}
</script>

<template>
  <div
    @dragover.prevent="onDragOver"
    ref="containerRef"
    @drop="onDrop"
    class="relative w-full h-full border border-amber-600 overflow-hidden"
    :class="{
      'cursor-grab active:cursor-grabbing': isPanning,
      'cursor-crosshair': placementMode,
    }"
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
      @click="
        (e) => {
          onPlaceNewTable(e)
        }
      "
      @dragstart="onDragStart"
      @dragend="onTableDragEnd"
    >
      <v-layer>
        <v-group
          v-for="table in tables.filter((t) => t.type === 'circle')"
          :key="table.id"
          :config="{ ...tableConfig(table), draggable: true }"
        >
          <CircleTable :circleTable="table" :hoverId="hoverId" />
        </v-group>

        <v-group
          v-for="table in tables.filter((t) => t.type === 'rect')"
          :key="table.id"
          :config="{ ...tableConfig(table), draggable: true }"
        >
          <RectTable :rectTable="table" :hoverId="hoverId" />
        </v-group>
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
      @createCircleTable="onCreateCircle"
      @createRectTable="onCreateRect"
      @focusContent="resetView()"
    />
  </div>
</template>

<style></style>
