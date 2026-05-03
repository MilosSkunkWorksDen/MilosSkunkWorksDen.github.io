<script setup lang="ts">
import PeopleSpreadsheet from '@/components/PeopleSpreadsheet.vue'
import Button from '@/components/ui/button/Button.vue'
import useDbStorage from '@/composables/useDbStorage'
import usePeople, { type Person } from '@/composables/usePeople'
import { watch } from 'vue'

const { records, save } = useDbStorage('people')

watch(records, () => {
  save()
})
</script>

<template>
  <div class="flex-1 flex flex-col min-h-[calc(100svh-10px)] overflow-hidden">
    <div class="flex flex-col gap-4 overflow-hidden border-b p-4">
      <div class="text-lg">People</div>
    </div>

    <div class="flex-1 p-0.5 pb-4">
      <!-- <PeopleTable /> -->
      <PeopleSpreadsheet v-model="records" />
    </div>
  </div>
</template>
