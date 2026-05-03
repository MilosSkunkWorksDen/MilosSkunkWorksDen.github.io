<script setup lang="ts">
import { readonly, ref } from 'vue'
import { Spreadsheet, Worksheet } from '@jspreadsheet-ce/vue'
import 'jsuites/dist/jsuites.css'
import 'jspreadsheet-ce/dist/jspreadsheet.css'
import Button from './ui/button/Button.vue'
import type { Person } from '@/composables/usePeople'

type SpreadsheetType = typeof Spreadsheet

const model = defineModel<Person[]>()

const columns = [
  { key: 'group', align: 'left', title: 'Group', type: 'text', width: 200 },
  { key: 'name', align: 'left', title: 'Name', type: 'text', width: 300 },
  { key: 'attending', align: 'center', title: 'Attending', type: 'checkbox', width: 90 },
  { key: 'comment', align: 'left', title: 'Comment', type: 'text', width: 600 },
  { key: 'table_name', align: 'left', title: 'Table', type: 'text', width: 200 },
]

function encode(people: Person[]) {
  return people.map((person) =>
    columns.map((col) => (col?.key ? person[col.key as keyof Person] : null)),
  )
}

function decode(data: Array<Array<any>>): Person[] {
  return data
    .map((p, index) => {
      return columns.reduce(
        (acc: any, c, i) => {
          if (c?.key) {
            acc[c.key] = p[i]
          }
          return acc
        },
        { id: index + 1 } as Person,
      )
    })
    .filter((p) => !!p.name)
}

const updates = (instance: SpreadsheetType, cell: any, x: number, y: number, value: any) => {
  const data = instance.getData()
  model.value = decode(data)
}

const spreadsheetRef = ref()

function addRow() {
  const instance = spreadsheetRef.value.current[0]
  instance?.insertRow()
}
</script>

<template>
  <div class="wrapper overflow-x-auto">
    <Spreadsheet ref="spreadsheetRef" :onchange="updates">
      <Worksheet
        :data="encode(model ?? [])"
        :columns="columns"
        :filters="false"
        :allowInsertColumn="false"
        :allowDeleteColumn="false"
        :allowRenameColumn="false"
        :minDimensions="[1, 1]"
      />
    </Spreadsheet>

    <div class="px-4 py-2">
      <Button @click="addRow" size="sm" variant="outline"> Add </Button>
      <span class="text-xs"> (Enter) </span>
    </div>
  </div>
</template>

<style>
.jss_worksheet {
  /* width: 100%; */
  /* border: none !important; */
}
</style>
