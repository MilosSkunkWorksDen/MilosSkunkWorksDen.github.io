<script setup lang="ts">
import Person from '@/components/Person.vue'
import Button from '@/components/Button.vue'
import Table from '@/components/Table.vue'
import usePeople from '@/composables/usePeople'
import useTables from '@/composables/useTables'
import draggable from 'vuedraggable'

const { people, save: savePeople } = usePeople()
const { tables, save: saveTables } = useTables(10)

// HANDLE SAVE & MOUNT
function handleSave() {
  saveTables()
  savePeople()
}
</script>

<template>
  <div class="flex-1 flex max-h-[calc(100svh-10px)] overflow-hidden">
    <div class="border-r border-neutral-100 flex flex-col gap-4 min-w-80 overflow-hidden">
      <div class="text-lg px-4 pt-4">Assign People To Tables</div>

      <div class="flex-1 flex flex-col overflow-hidden px-4 pb-1">
        <div class="px-2 flex-none text-xs text-black/60 mb-1">People</div>

        <draggable
          v-model="people"
          item-key="name"
          class="overflow-y-auto scrollbar-thin flex-1"
          drag-class="draggable-person-drag"
          ghost-class="draggable-person-ghost"
          chosen-class="draggable-person-chosen"
          group="assign-people-to-tables"
        >
          <template #item="{ element, index }">
            <div class="item">
              <Person :person="element" :key="element.name" />
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <div class="flex-1 p-4 overflow-y-auto scrollbar-thin">
      <Table v-for="(t, index) in tables" :table="t" :key="index" />
    </div>

    <div class="fixed bottom-5 right-5">
      <Button @click="handleSave"> Save </Button>
    </div>
  </div>
</template>
