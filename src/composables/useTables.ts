import { computed, ref } from 'vue'
import type { Person } from './usePeople'
import { v4 as uuid } from 'uuid'

export interface Table {
  id: string | number
  name: string
  people: Person[]
}

const STORAGE_KEY = 'tables'

export default function useTables(count: number) {
  const tables = ref<Table[]>(get([]))

  const getUniqueId = () => {
    return uuid()
  }

  // 👇 initialize if empty
  if (!tables.value.length && count > 0) {
    tables.value = createTables(count)
    save()
  }

  function get<T>(fallback: T): T {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : fallback
    } catch (e) {
      return fallback
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tables.value))
  }

  function createTables(count: number): Table[] {
    return Array.from({ length: count }, (_, i) => ({
      id: getUniqueId(),
      name: `Table ${i + 1}`,
      people: [],
    }))
  }

  function remove(id: Table['id']) {
    tables.value = [...tables.value.filter((t) => t.id !== id)]
  }

  function addNew() {
    tables.value.push({
      id: getUniqueId(),
      name: `Table ${tables.value.length + 1}`,
      people: [],
    })
  }

  return { tables, save, remove, addNew }
}
