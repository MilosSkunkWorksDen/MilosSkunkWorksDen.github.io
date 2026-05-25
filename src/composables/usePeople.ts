import { computed } from 'vue'
import useDbStorage from './useDbStorage'
import Person from '@/components/Person.vue'
import type { Table } from './useTables'

export interface Person {
  id: number
  table_id?: Table['id']
  table_order?: number
  group?: string
  name: string
  attending: boolean
}

export default function usePeople() {
  const { records, save } = useDbStorage('people')

  const people = computed(() => {
    return records.value.filter((p) => !!p.name && p.attending === true) as Person[]
  })

  function update(person: Person) {
    records.value = [...records.value.map((r) => (r.id == person.id ? person : r))]
  }

  return { people, update, save }
}
