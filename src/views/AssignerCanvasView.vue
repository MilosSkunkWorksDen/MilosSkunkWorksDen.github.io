<script setup lang="ts">
import TablesCanvas from '@/components/TablesCanvas.vue'
import PersonComponent from '@/components/Person.vue'
import TableComponent from '@/components/Table.vue'
import Button from '@/components/ui/button/Button.vue'
import usePeople, { type Person } from '@/composables/usePeople'
import useTables, { type Table } from '@/composables/useTables'
import { Plus } from '@lucide/vue'
import { nextTick, onMounted, ref, watch } from 'vue'
import draggable from 'vuedraggable'

const { people, update: updateUser, save: saveUsers } = usePeople()
const {
  tables,
  save: saveTables,
  remove: removeTable,
  addNew: addNewTable,
  update: updateTable,
} = useTables()

const pendingPeople = ref<Person[]>([])

onMounted(() => {
  tables.value = tables.value.map((table: any) => ({
    ...table,
    people: people.value.filter((p) => p?.table_id === table.id),
  }))

  const assignedIds = new Set(tables.value.flatMap((t) => t.people.map((p) => p.id)))
  pendingPeople.value = people.value.filter((person) => !assignedIds.has(person.id))
})

const tablesListRef = ref<HTMLDivElement>()

async function handleAddTable() {
  addNewTable()
  saveTables()
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
    saveTables()
  } else if (confirm(`Table ${table.name} has people sitting. Are you sure ?`)) {
    removeTable(table.id)
    saveTables()

    pendingPeople.value = [...pendingPeople.value, ...table.people]
    table.people.forEach((p) => {
      updateUser({ ...p, table_id: undefined })
    })
    saveUsers()
  }
}

function handleUpdateTable(table: Table) {
  updateTable(table)
  saveTables()

  let updated = false
  table.people.forEach((p) => {
    if (p.table_id !== table.id) {
      updateUser({ ...p, table_id: table.id })
      updated = true
    }
  })

  if (updated) {
    saveUsers()
  }
}

function updateUsers(table: Table) {}
</script>

<template>
  <div class="flex-1 flex max-h-[calc(100svh-10px)] overflow-hidden">
    <div class="border-r border-neutral-100 flex flex-col gap-4 min-w-80 overflow-hidden">
      <div class="text-lg px-4 pt-4">Seating Assignments</div>

      <div class="flex-1 flex flex-col overflow-hidden px-4 pb-1">
        <div class="px-2 flex-none text-xs text-black/60 mb-1">People</div>

        <draggable
          v-model="pendingPeople"
          item-key="name"
          class="overflow-y-auto scrollbar-thin flex-1"
          drag-class="draggable-person-drag"
          ghost-class="draggable-person-ghost"
          chosen-class="draggable-person-chosen"
          group="assign-people-to-tables"
        >
          <template #item="{ element, index }">
            <div class="item my-1">
              <PersonComponent :person="element" :key="element.name" />
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <div ref="tablesListRef" class="flex-1 overflow-auto scrollbar-thin">
      <TablesCanvas />
    </div>

    <!-- <div class="fixed bottom-5 right-5">
      <Button size="lg" @click="handleSave"> Save </Button>
    </div> -->
  </div>
</template>
