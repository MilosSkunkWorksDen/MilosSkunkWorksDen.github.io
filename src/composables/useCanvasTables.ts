import { computed, ref, type Ref } from 'vue'
import type { Person } from './usePeople'
import { v4 as uuid } from 'uuid'
import type { BaseCircle, BaseRect, CanvasTable } from '@/components/canvas/types'

// const STORAGE_KEY = 'canvas_tables'
const STORAGE_KEY = 'tables'

export default function useCanvasTables() {
  const tables = ref<CanvasTable[]>(load())

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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }

  function remove(id: CanvasTable['id']) {
    tables.value = [...tables.value.filter((t) => t.id !== id)]
  }

  function update(table: CanvasTable) {
    tables.value = [...tables.value.map((t) => (t.id == table.id ? table : t))]
  }

  function addNew(data: BaseCircle | BaseRect) {
    tables.value.push({
      id: getUniqueId(),
      name: `Table ${tables.value.length + 1}`,
      people: [],
      ...data,
    })
  }

  function find(id: CanvasTable['id']) {
    return tables.value.find((t) => t.id == id)
  }

  return { tables, save, remove, addNew, update, find }
}
