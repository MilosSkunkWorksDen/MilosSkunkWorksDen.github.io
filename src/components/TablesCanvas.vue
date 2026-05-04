<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Circle } from 'lucide-vue-next'
import { Square } from '@lucide/vue'

import CanvasMenu from './canvas/CanvasMenu.vue'
import CanvasActionBar from './canvas/CanvasActionBar.vue'

export type CanvasTable = {
  id: string | number
  type: 'circle' | 'rect'
  x: number
  y: number
  width: number
  height: number
  label: string
}

const stage = ref()
const container = ref()
const containerSize = ref<{
  width: number
  height: number
}>()

const shapes = ref<any>([])
const list = ref<any[]>([])
const dragItemId = ref(null)

const handleDragstart = (e: any) => {
  // save drag element:
  dragItemId.value = e.target.id()
  // move current element to the top:
  const item = list.value.find((i) => i.id === dragItemId.value)
  const index = list.value.indexOf(item)
  list.value.splice(index, 1)
  list.value.push(item)
}

const handleDragend = () => {
  dragItemId.value = null
}

onMounted(() => {
  //  const el = val.getStage().attrs.container
  const el = container.value
  const rect = el.getBoundingClientRect()

  containerSize.value = {
    width: rect.width,
    height: rect.height,
  }

  for (let n = 0; n < 30; n++) {
    list.value.push({
      id: Math.round(Math.random() * 10000).toString(),
      x: Math.random() * containerSize.value.width,
      y: Math.random() * containerSize.value.height,
      rotation: Math.random() * 180,
      scale: Math.random(),
    })
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
    width: 200,
    height: 100,
    label: `Table ${tables.value.length + 1}`,
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
    label: `Table ${tables.value.length + 1}`,
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
    width: 200,
    height: 100,
    label: `Table 1`,
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

function onRightClick(e, table: CanvasTable) {
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
</script>

<template>
  <div ref="container" class="relative w-full h-full cursor-grab active:cursor-grabbing">
    <v-stage
      v-if="containerSize && containerSize?.width > 0"
      ref="stage"
      class="h-full w-full"
      :config="{ ...containerSize, draggable: true }"
      @wheel="handleWheel"
    >
      <v-layer>
        <v-group
          v-for="table in tables.filter((t) => t.type === 'circle')"
          :key="table.id"
          :config="{
            draggable: true,
            onClick: () => (selectedId = table.id),
            onMouseEnter: () => (hoverId = table.id),
            onMouseLeave: () => (hoverId = null),
            onContextMenu: (e) => onRightClick(e, table),
          }"
        >
          <v-circle
            :config="{
              x: table.x,
              y: table.y,
              radius: table.height,
              fill: baseTableStyle.fill,
              stroke: selectedId === table.id ? '#3B82F6' : baseTableStyle.stroke,
              strokeWidth: 1.5,
              shadowBlur: hoverId === table.id ? 14 : 8,
              shadowOpacity: 0.1,
            }"
          />

          <v-text
            :config="{
              text: table.label,
              x: table.x - table.height,
              y: table.y - 10,
              width: table.width,
              align: 'center',
              fontSize: 13,
              fill: '#334155',
            }"
          />
        </v-group>

        <v-group
          v-for="table in tables.filter((t) => t.type === 'rect')"
          :key="table.id"
          :config="{
            draggable: true,
            onClick: () => (selectedId = table.id),
            onMouseEnter: () => (hoverId = table.id),
            onMouseLeave: () => (hoverId = null),
            onContextMenu: (e) => onRightClick(e, table),
          }"
        >
          <!-- Table body -->
          <v-rect
            :config="{
              x: table.x,
              y: table.y,
              width: table.width,
              height: table.height,
              fill: baseTableStyle.fill,
              stroke: selectedId === table.id ? '#3B82F6' : baseTableStyle.stroke,
              strokeWidth: 1.5,
              cornerRadius: 14,
              shadowBlur: hoverId === table.id ? 14 : 8,
              shadowOpacity: 0.1,
              shadowOffsetY: 3,
            }"
          />

          <!-- Label (centered) -->
          <v-text
            :config="{
              text: table.label,
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
