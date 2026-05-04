<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { watch } from 'vue'
import type { CanvasTable } from '../TablesCanvas.vue'
import DropdownMenuShortcut from '../ui/dropdown-menu/DropdownMenuShortcut.vue'
import { Pen, SquarePen, TrashIcon } from 'lucide-vue-next'

interface Props {
  x?: number
  y?: number
  table?: CanvasTable
}

const props = defineProps<Props>()
const isOpen = defineModel('open')

function updateOpen(val: boolean) {
  if (!val) {
    isOpen.value = false
  }
}

const emit = defineEmits<{
  (e: 'delete', table: CanvasTable): void
  (e: 'edit', table: CanvasTable): void
}>()
</script>

<template>
  <span v-if="isOpen" class="absolute" :style="{ left: x + 'px', top: y + 'px' }">
    <DropdownMenu @update:open="updateOpen" default-open>
      <DropdownMenuTrigger>
        <span></span>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        <DropdownMenuLabel>{{ table?.name }} </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="$emit('edit', table as CanvasTable)">
          <SquarePen />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" @click="$emit('delete', table as CanvasTable)">
          <Pen />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </span>
</template>
