<script setup lang="ts">
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
  tables.value = tables.value
    .filter((t) => !t.without_people)
    .map((table: any) => ({
      ...table,
      people: people.value
        .filter((p) => p?.table_id === table.id)
        .sort((a, b) => (a.table_order || 0) - (b.table_order || 0)),
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

function handleUpdateTable(table: Table, ev: any = null) {
  updateTable(table)
  saveTables()

  let updated = false
  table.people.forEach((p, index) => {
    if (p.table_id !== table.id || p.table_order != index) {
      updateUser({ ...p, table_id: table.id, table_order: index })
      updated = true
    }
  })

  if (ev?.removed) {
    updated = true
    updateUser({ ...ev.removed.element, table_id: undefined })
  }

  if (updated) {
    saveUsers()
  }
}

function handlePendingPeopleChange(table: Table) {}

const handleTablesOrderChange = async () => {
  tables.value.forEach((table, index) => {
    updateTable({
      ...table,
      order: index,
    })
  })

  saveTables()
}
</script>

<template>
  <div class="flex-1 flex max-h-[calc(100svh-10px)] overflow-hidden">
    <div class="border-r shadow-sm flex flex-col gap-4 min-w-80 overflow-hidden">
      <div class="text-lg px-4 pt-4">Seating Assignments</div>

      <div class="flex-1 flex flex-col overflow-y-auto scrollbar-thin px-4 pb-1">
        <div class="px-2 flex-none text-xs text-black/60 mb-1">People</div>

        <draggable
          v-model="pendingPeople"
          item-key="name"
          class=""
          drag-class="draggable-person-drag"
          ghost-class="draggable-person-ghost"
          chosen-class="draggable-person-chosen"
          group="assign-people-to-tables"
          @change="handlePendingPeopleChange"
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
      <draggable
        v-model="tables"
        item-key="id"
        handle=".drag-handle"
        :animation="200"
        @end="handleTablesOrderChange"
      >
        <template #item="{ element: t, index }">
          <div class="relative">
            <TableComponent
              @delete="handleRemoveTable(t)"
              @update="handleUpdateTable"
              :table="t"
              :index="index"
            />
          </div>
        </template>
      </draggable>
      <div class="flex justify-center items-center m-4">
        <Button variant="secondary" @click="handleAddTable">
          <Plus />
          <span>Add </span>
        </Button>
      </div>
    </div>

    <!-- <div class="fixed bottom-5 right-5">
      <Button size="lg" @click="handleSave"> Save </Button>
    </div> -->
  </div>
</template>
