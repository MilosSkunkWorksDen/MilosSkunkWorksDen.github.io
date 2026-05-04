<script setup lang="ts">
import { Circle, Square } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'createCircleTable'): void
  (e: 'createRectTable'): void
}>()
</script>

<template>
  <div
    class="cursor-default absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-sidebar shadow border px-4 py-2 rounded-xl"
  >
    <div @click="$emit('createCircleTable')" class="hover:bg-primary/5 text-primary p-1 rounded-md">
      <Circle strokeWidth="{1}" class="size-6" />
    </div>
    <div @click="$emit('createRectTable')" class="hover:bg-primary/5 text-primary p-1 rounded-md">
      <Square strokeWidth="{1}" class="size-6" />
    </div>
  </div>
</template>
