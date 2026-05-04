<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Button from './ui/button/Button.vue'
import { Circle } from 'lucide-vue-next'
import { Square } from '@lucide/vue'

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

const tables = ref<any>([])

const baseTableStyle = {
  fill: '#ffffff',
  stroke: '#CBD5E1',
  strokeWidth: 1.5,
  shadowColor: 'rgba(0,0,0,0.08)',
  shadowBlur: 10,
  shadowOffsetY: 4,
  cornerRadius: 10,
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
          @click="selectedId = table.id"
          @mouseenter="hoverId = table.id"
          @mouseleave="hoverId = null"
          :draggable="true"
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
          @click="selectedId = table.id"
          @mouseenter="hoverId = table.id"
          @mouseleave="hoverId = null"
          :draggable="true"
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

    <div
      class="cursor-default absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-sidebar shadow border px-4 py-2 rounded-xl"
    >
      <div @click="addCircleTable" class="hover:bg-primary/5 text-primary p-1 rounded-md">
        <Circle strokeWidth="{1}" class="size-6" />
      </div>
      <div @click="addRectTable" class="hover:bg-primary/5 text-primary p-1 rounded-md">
        <Square strokeWidth="{1}" class="size-6" />
      </div>
    </div>
  </div>
</template>

<style></style>
