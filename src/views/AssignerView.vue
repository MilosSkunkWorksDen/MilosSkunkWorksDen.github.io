<script setup lang="ts">
import Person from '@/components/Person.vue'
import Table from '@/components/Table.vue'
import usePeople from '@/composables/usePeople'
import useTables from '@/composables/useTables'
import { ChevronDown } from '@lucide/vue'

const { people } = usePeople()
const { tables } = useTables()
</script>

<template>
  <div class="flex-1 flex">
    <div class="p-4 border-r border-neutral-100 flex flex-col gap-4 min-w-80">
      <div class="text-lg">Assign People To Tables</div>
      <div class="flex-1 flex flex-col">
        <div class="text-xs text-black/60 mb-2">People</div>
        <Person v-for="(p, index) in people" :person="p" :key="index" />
      </div>
    </div>

    <div class="flex-1 p-4">
      <Table v-for="(t, index) in tables" :table="t" :key="index" />
    </div>
  </div>
</template>
