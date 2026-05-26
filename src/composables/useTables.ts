import { computed, ref, type Ref } from 'vue'
import type { Person } from './usePeople'
import { v4 as uuid } from 'uuid'

export interface Table {
  id: string | number
  name: string
  people: Person[]
  order?: number
  without_people?: boolean
}

const STORAGE_KEY = 'tables'

export default function useTables() {
  const tables = ref<Table[]>(load().sort((a, b) => (a.order || 0) - (b.order || 0)))

  const getUniqueId = () => {
    return uuid()
  }

  function load(): Table[] {
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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
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

  function find(id: Table['id']) {
    return tables.value.find((t) => t.id == id)
  }

  return { tables, save, remove, addNew, update, find }
}
