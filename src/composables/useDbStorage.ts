import { ref, watch } from 'vue'

export default function useDbStorage(table: string) {
  const TABLE_KEY = `db_${table}`

  const records = ref<any[]>(load())

  function load() {
    try {
      const raw = localStorage.getItem(TABLE_KEY)
      if (!raw) return []

      const parsed = JSON.parse(raw)
      return parsed
    } catch (e) {
      return []
    }
  }

  function save() {
    localStorage.setItem(TABLE_KEY, JSON.stringify(records.value))
  }

  return { records, save }
}
