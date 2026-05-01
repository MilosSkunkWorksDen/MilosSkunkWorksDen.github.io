<script setup lang="ts">
import type { Table } from '@/composables/useTables'
import { ChevronDown } from '@lucide/vue'

const isOpen = defineModel('open', {
  default: true,
})

defineProps<{
  table: Table
}>()
</script>

<template>
  <div class="px-4 py-2 my-2 rounded-lg shadow-sm border border-neutral-50">
    <div class="flex items-center justify-between cursor-pointer" @click="isOpen = !isOpen">
      <div class="flex gap-2 items-center">
        <ChevronDown class="size-4" />
        <span>
          {{ table.name }}
        </span>
      </div>

      <div class="flex items-center justify-center gap-2 text-xs">
        <span> Count</span> {{ table.people.length ?? 0 }}
      </div>
    </div>

    <div
      v-if="isOpen"
      class="mt-2 p-4 min-h-8 border-2 border-neutral-300 border-dashed rounded-lg relative"
    >
      <div v-for="p in table.people">
        {{ p.name }}
      </div>

      <div
        class="text-xs text-neutral-400 absolute left-1/2 -translate-x-1/2"
        :class="[table.people.length === 0 ? 'top-1/2 -translate-y-1/2' : 'bottom-1']"
      >
        Drag & Drop Person
      </div>
    </div>
  </div>
</template>
