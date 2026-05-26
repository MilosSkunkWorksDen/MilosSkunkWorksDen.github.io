<script setup lang="ts">
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import CanvasMenu from './canvas/CanvasMenu.vue'
import CanvasActionBar from './canvas/CanvasActionBar.vue'
import type { Person } from '@/composables/usePeople'
import type { CanvasTable, ContextMenu } from './canvas/types'
import PersonComponent from '@/components/Person.vue'
import useTableGeometry from '@/composables/useTableGeometry'
import { exportStageToPDF, useSize, useView } from '@/composables/useCanvas'
import { useCreateTablesActions } from '@/composables/useCreateTablesActions'
import CircleTable from './canvas/CircleTable.vue'
import RectTable from './canvas/RectTable.vue'
import { useCanvasTablesResize, useCanvasTablesSelect } from '@/composables/useCanvasTablesSelect'
import jsPDF from 'jspdf'

const props = defineProps<{
  people: Person[]
  tables: CanvasTable[]
}>()

const emit = defineEmits<{
  (e: 'addCircleTable', coordinates: { x: number; y: number }): void
  (e: 'addRectTable', coordinates: { x: number; y: number }): void
  (e: 'deleteTable', table: CanvasTable): void
  (e: 'editTable', table: CanvasTable): void
  (e: 'addPersonToTable', table: CanvasTable, person: Person): void
  (
    e: 'updateTableCoordinates',
    table: CanvasTable,
    coordinates: { x: CanvasTable['x']; y: CanvasTable['y'] },
    save: boolean,
  ): void
  (e: 'updateTable', table: CanvasTable): void
  (e: 'update:selectedId', id?: CanvasTable['id']): void
}>()

const stageRef = ref()
const layerRef = ref()
const containerRef = ref()

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

  if (table && !table.without_people && person) {
    emit('addPersonToTable', table, person)
  }
}

function onDragOver(e: any) {
  const shape = getDragOverShape(e)
  handleHover(shape?.attrs.table)
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

const { handleHover, selectedId, hoveredId, tableEvents, contextMenu, checkIfTableClick } =
  useCanvasTablesSelect(stageRef)

const { transformerRef, onTransformEnd, transformTable, removeTransformer } = useCanvasTablesResize(
  {
    stageRef,
    selectedId,
    transformed: (t) => emit('updateTable', t),
  },
)

const onDragEnd = (e: any) => {
  const elType = e.target.attrs?.elType
  if (elType == 'table-group') {
    return onTableDragged(e)
  }
}

const onTableDragged = (e: any) => {
  const id = e.target.attrs?.tableId
  const table = props.tables?.find((t) => t.id === id)

  if (id && table) {
    let pos = {
      x: e.target.x(),
      y: e.target.y(),
    }

    emit('updateTableCoordinates', table, pos, true)
  }
}

const selectedTable = computed(() => {
  return selectedId.value ? props.tables.find((t) => t.id == selectedId.value) : undefined
})

watch(selectedId, (v) => {
  emit('update:selectedId', v)
})

function exportPDF() {
  const stage = stageRef.value.getNode()
  exportStageToPDF(stage)
}
</script>

<template>
  <div
    @dragover.prevent="onDragOver"
    ref="containerRef"
    @drop="onDrop"
    class="relative w-full h-full overflow-hidden"
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
        (e: any) => {
          onPlaceNewTable(e)
          checkIfTableClick(e)
          removeTransformer()
        }
      "
      @dragend="onDragEnd"
    >
      <v-layer ref="layerRef">
        <v-group
          v-for="table in tables.filter((t) => t.type === 'circle')"
          :key="table.id"
          :config="{
            elType: 'table-group',
            tableId: table.id,
            draggable: true,
            x: table.x,
            y: table.y,
          }"
        >
          <CircleTable
            v-on="tableEvents(table)"
            :baseTable="table"
            :hoveredId="hoveredId"
            :selectedId="selectedId"
            @transformend="onTransformEnd($event, table)"
          />
        </v-group>

        <v-group
          v-for="table in tables.filter((t) => t.type === 'rect')"
          :key="table.id"
          :config="{
            elType: 'table-group',
            tableId: table.id,
            draggable: true,
            x: table.x,
            y: table.y,
          }"
        >
          <RectTable
            v-on="tableEvents(table)"
            :baseTable="table"
            :hoveredId="hoveredId"
            :selectedId="selectedId"
            @transformend="onTransformEnd($event, table)"
          />
        </v-group>

        <v-transformer
          ref="transformerRef"
          :config="{
            keepRatio: selectedTable?.type === 'circle',
            enabledAnchors:
              selectedTable?.type === 'circle'
                ? ['top-left', 'top-right', 'bottom-left', 'bottom-right']
                : undefined,
          }"
        />
      </v-layer>
    </v-stage>

    <CanvasMenu
      v-model:open="contextMenu.visible"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :table="contextMenu.table"
      @edit="$emit('editTable', $event)"
      @delete="$emit('deleteTable', $event)"
      @resize="transformTable($event)"
    />

    <CanvasActionBar
      @createCircleTable="onCreateCircle"
      @createRectTable="onCreateRect"
      @focusContent="resetView"
      @downloadLayout="exportPDF"
    />
  </div>
</template>

<style></style>
