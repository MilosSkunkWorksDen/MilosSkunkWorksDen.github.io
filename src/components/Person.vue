<script setup lang="ts">
import type { Person } from '@/composables/usePeople'
import type { Table } from '@/composables/useTables'
import { ChevronDown } from '@lucide/vue'

defineProps<{
  person: Person
}>()
</script>

<template>
  <div class="flex-1 flex flex-col gap-1">
    <div>
      {{ person.name }}
    </div>
  </div>
</template>
