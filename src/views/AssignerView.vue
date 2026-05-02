<script setup lang="ts">
import PersonComponent from '@/components/Person.vue'
import TableComponent from '@/components/Table.vue'
import Button from '@/components/ui/button/Button.vue'
import usePeople from '@/composables/usePeople'
import useTables, { type Table } from '@/composables/useTables'
import { Plus } from '@lucide/vue'
import { nextTick, ref, watch } from 'vue'
import draggable from 'vuedraggable'

const { people, save: savePeople, moveBackToPending } = usePeople()
const { tables, save: saveTables, remove: removeTable, addNew: addNewTable } = useTables(1)

const tablesListRef = ref<HTMLDivElement>()

// HANDLE SAVE & MOUNT
function handleSave() {
  saveTables()
  savePeople()
}

async function handleAddTable() {
  addNewTable()
}

function onAfterEnter(el: Element) {
  requestAnimationFrame(() => {
    const el = tablesListRef.value
    if (!el) return

    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth',
    })
  })
}

function handleRemoveTable(table: Table) {
  if (table.people.length == 0) {
    removeTable(table.id)
  } else if (confirm(`Table ${table.name} has people sitting. Are you sure ?`)) {
    removeTable(table.id)
    moveBackToPending(table.people)
  }
}

watch(tables, (val) => {
  console.log({ ...val })
})
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
              <PersonComponent :person="element" :key="element.name" />
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <div ref="tablesListRef" class="flex-1 p-4 overflow-y-auto scrollbar-thin">
      <TransitionGroup
        @after-enter="onAfterEnter"
        enter-from-class="opacity-0 translate-y-4 scale-95"
        enter-active-class="transition-all duration-300 ease-out"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-from-class="opacity-100"
        leave-active-class="transition-all duration-300 ease-in"
        leave-to-class="opacity-0"
      >
        <TableComponent
          @delete.prevent.stop="handleRemoveTable(t)"
          v-for="(t, index) in tables"
          :table="t"
          :key="t.id"
        />
      </TransitionGroup>
      <div class="flex justify-center items-center m-4">
        <Button variant="secondary" @click="handleAddTable">
          <Plus />
          <span>Add </span>
        </Button>
      </div>
    </div>

    <div class="fixed bottom-5 right-5">
      <Button size="lg" @click="handleSave"> Save </Button>
    </div>
  </div>
</template>
