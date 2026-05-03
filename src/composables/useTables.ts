import { computed, ref, type Ref } from 'vue'
import type { Person } from './usePeople'
import { v4 as uuid } from 'uuid'

export interface Table {
  id: string | number
  name: string
  people: Person[]
}

const STORAGE_KEY = 'tables'

export default function useTables(people: Ref<Person[]>) {
  const tables = ref<Table[]>(load())

  const getUniqueId = () => {
    return uuid()
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []

      const parsed = JSON.parse(raw)
      return parsed.map((table: any) => ({
        ...table,
        people: table.people
          .map((id: Person['id']) => people.value?.find((p) => p.id === id))
          .filter((p: Person | undefined) => !!p?.id),
      }))
    } catch (e) {
      return []
    }
  }

  function save() {
    const payload = tables.value.map((table) => ({
      ...table,
      people: table.people.map((p) => p.id),
    }))

    localStorage.setItem('tables', JSON.stringify(payload))
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
