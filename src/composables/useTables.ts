import { computed, ref } from 'vue'
import type { Person } from './usePeople'

export interface Table {
  id: number
  name: string
  people: Person[]
}

export default function useTables() {
  const tables = ref<Table[]>([
    {
      id: 1,
      name: 'Table 1',
      // people: [{ name: 'John Smith' }, { name: 'Emma Johnson' }],
      people: [],
    },
    {
      id: 2,
      name: 'Table 2',
      people: [{ name: 'Liam Brown' }, { name: 'Olivia Williams' }],
      // people: [],
    },
    {
      id: 3,
      name: 'Table 3',
      people: [{ name: 'Noah Jones' }, { name: 'Ava Garcia' }],
      // people: [],
    },
    {
      id: 4,
      name: 'Table 4',
      people: [{ name: 'Lucas Miller' }, { name: 'Mia Davis' }],
      // people: [],
    },
    {
      id: 5,
      name: 'Table 5',
      people: [{ name: 'Ethan Rodriguez' }, { name: 'Sophia Martinez' }],
      // people: [],
    },
  ])

  return { tables }
}
