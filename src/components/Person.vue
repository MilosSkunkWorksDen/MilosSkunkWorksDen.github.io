<script setup lang="ts">
import type { Person } from '@/composables/usePeople'

defineProps<{
  person: Person
}>()
</script>

<template>
  <div
    class="flex-1 flex flex-col gap-1 cursor-pointer hover:bg-neutral-50 px-2 py-1 rounded-md h-8"
  >
    <div>
      {{ person.name }}
    </div>
  </div>
</template>
