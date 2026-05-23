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
import useCanvasTables from '@/composables/useCanvasTables'
import type { CanvasTable } from '@/components/canvas/types'
import SelectedTableSheet from '@/components/canvas/SelectedTableSheet.vue'

const tablesListRef = ref<HTMLDivElement>()

const { people, update: updateUser, save: saveUsers } = usePeople()
const {
  tables,
  save: saveTables,
  remove: removeTable,
  addNew: addNewTable,
  update: updateTable,
} = useCanvasTables()

const pendingPeople = ref<Person[]>([])
onMounted(() => {
  tables.value = tables.value.map((table: any) => ({
    ...table,
    people: people.value.filter((p) => p?.table_id === table.id),
  }))

  const assignedIds = new Set(tables.value.flatMap((t) => t.people.map((p) => p.id)))
  pendingPeople.value = people.value.filter((person) => !assignedIds.has(person.id))
})

function addCircleTable(coo: { x: number; y: number }) {
  addNewTable({
    ...coo,
    type: 'circle',
    width: 150,
  })

  saveTables()
}

function addRectTable(coo: { x: number; y: number }) {
  addNewTable({
    ...coo,
    type: 'rect',
    width: 150 * 2,
    height: (150 * 2) / 3,
  })

  saveTables()
}

function deleteTable(table: CanvasTable) {
  if (table.people.length == 0) {
    removeTable(table.id)
    saveTables()
  } else if (confirm(`Table ${table.name} has people sitting. Are you sure ?`)) {
    removeAllPeopleFromTable(table)
    removeTable(table.id)
    saveTables()
  }
}

function removeAllPeopleFromTable(table: CanvasTable) {
  const newUsers = table.people.map((p) => {
    const newUser = { ...p, table_id: undefined }
    updateUser(newUser)
    return newUser
  })
  saveUsers()

  pendingPeople.value = [...newUsers, ...pendingPeople.value]
}

function addPersonToTable(table: CanvasTable, person: Person) {
  const oldTable = person.table_id ? tables.value.find((t) => t.id == person.table_id) : undefined
  if (oldTable) {
    removePersonFromTable(oldTable, person)
  }

  const newPerson = { ...person, table_id: table.id }
  updateUser(newPerson)
  saveUsers()

  // TODO: bad ux keep order and uniqueness of people
  updateTable({ ...table, people: [...table.people.filter((p) => p.id !== person.id), newPerson] })
  saveTables()

  pendingPeople.value = pendingPeople.value.filter((p) => p.id != person.id)
}

function removePersonFromTable(table: CanvasTable, person: Person) {
  updateUser({ ...person, table_id: undefined })
  saveUsers()

  updateTable({ ...table, people: [...table.people.filter((p) => p.id !== person.id)] })
  saveTables()

  pendingPeople.value = [person, ...pendingPeople.value.filter((p) => p.id != person.id)]
}

function updateTableCoordinates(
  table: CanvasTable,
  coordinates: { x: CanvasTable['x']; y: CanvasTable['y'] },
  save: boolean = false,
) {
  updateTable({ ...table, ...coordinates })
  if (save) saveTables()
}

function onDragStart(e: any, person: Person) {
  e.dataTransfer.setData('person_id', person.id)
}

const selectedTable = ref<CanvasTable>()
// watch(tables, (v) => console.log({ ...v }), { deep: true })
</script>

<template>
  <div class="flex-1 flex max-h-[calc(100svh-10px)] overflow-hidden">
    <div class="border-r shadow-sm flex flex-col gap-4 min-w-80 overflow-hidden z-1">
      <div class="text-lg px-4 pt-4">Seating Assignments</div>

      <div class="flex-1 flex flex-col overflow-y-auto scrollbar-thin px-4 pb-1">
        <div class="px-2 flex-none text-xs text-black/60 mb-1">People</div>

        <div
          v-for="person in pendingPeople"
          :key="person.id"
          :draggable="true"
          @dragstart="onDragStart($event, person)"
        >
          <PersonComponent :person="person" />
        </div>
      </div>
    </div>

    <div ref="tablesListRef" class="flex-1 overflow-auto scrollbar-thin">
      <TablesCanvas
        @add-circle-table="addCircleTable"
        @add-rect-table="addRectTable"
        @delete-table="deleteTable"
        @add-person-to-table="addPersonToTable"
        @update-table-coordinates="updateTableCoordinates"
        @update-table="
          (t) => {
            updateTable({ ...t })
            saveTables()
          }
        "
        :people="pendingPeople"
        :tables="tables"
        v-model:selected-table="selectedTable"
      />
    </div>

    <!-- <SelectedTableSheet
      :table="selectedTable"
      :open="!!selectedTable?.id"
      @update:open="
        (o) => {
          if (!o) {
            selectedTable = undefined
          }
        }
      "
      @update-table="
        (t) => {
          updateTable({ ...t })
          saveTables()
        }
      "
    /> -->
    <!-- <div class="absolute bg-red-500 right-0 top-5 bottom-5">
      {{ selectedTable.name }}
    </div> -->

    <!-- <div class="fixed bottom-5 right-5">
      <Button size="lg" @click="handleSave"> Save </Button>
    </div> -->
  </div>
</template>
