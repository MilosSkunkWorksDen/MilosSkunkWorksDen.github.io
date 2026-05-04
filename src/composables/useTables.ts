import { computed, ref, type Ref } from 'vue'
import type { Person } from './usePeople'
import { v4 as uuid } from 'uuid'

export interface Table {
  id: string | number
  name: string
  people: Person[]
}

const STORAGE_KEY = 'tables'

export default function useTables() {
  const tables = ref<Table[]>(load())

  const getUniqueId = () => {
    return uuid()
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []

      return JSON.parse(raw)
    } catch (e) {
      return []
    }
  }

  function save() {
    const payload = tables.value.map((table) => ({
      ...table,
      people: [],
    }))

    localStorage.setItem('tables', JSON.stringify(payload))
  }

  function remove(id: Table['id']) {
    tables.value = [...tables.value.filter((t) => t.id !== id)]
  }

  function update(table: Table) {
    tables.value = [...tables.value.map((t) => (t.id == table.id ? table : t))]
  }

  function addNew() {
    tables.value.push({
      id: getUniqueId(),
      name: `Table ${tables.value.length + 1}`,
      people: [],
    })
  }

  return { tables, save, remove, addNew, update }
}
