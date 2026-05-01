import { computed, ref } from 'vue'
import type { Person } from './usePeople'

export interface Table {
  id: number
  name: string
  people: Person[]
}

const STORAGE_KEY = 'tables'

export default function useTables(count: number) {
  const tables = ref<Table[]>(get([]))

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
      id: i + 1,
      name: `Table ${i + 1}`,
      people: [],
    }))
  }

  return { tables, save }
}
