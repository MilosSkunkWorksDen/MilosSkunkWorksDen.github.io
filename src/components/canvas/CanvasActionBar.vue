<script setup lang="ts">
import { Circle, Focus, Square, SquareDashed } from 'lucide-vue-next'
import { Separator } from '@/components/ui/separator'

const emit = defineEmits<{
  (e: 'createCircleTable'): void
  (e: 'createRectTable'): void
  (e: 'focusContent'): void
}>()
</script>

<template>
  <div
    class="cursor-default absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-sidebar shadow-xs border rounded-xl"
  >
    <div class="flex gap-2 h-10 items-center text-sm px-4 py-2">
      <div
        @click="$emit('createCircleTable')"
        class="hover:bg-primary/5 text-primary p-1 rounded-md"
      >
        <Circle strokeWidth="{1}" class="size-6" />
      </div>
      <div @click="$emit('createRectTable')" class="hover:bg-primary/5 text-primary p-1 rounded-md">
        <Square strokeWidth="{1}" class="size-6" />
      </div>
      <Separator orientation="vertical" />
      <div @click="$emit('focusContent')" class="hover:bg-primary/5 text-primary p-1 rounded-md">
        <Focus strokeWidth="{1}" class="size-6" />
      </div>
    </div>
  </div>
</template>
