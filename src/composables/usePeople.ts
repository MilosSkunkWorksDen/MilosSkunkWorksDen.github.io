import { computed, ref } from 'vue'
import type { Table } from './useTables'

export interface Person {
  id: number
  name: string
}

const STORAGE_KEY = 'people'

export default function usePeople() {
  const people = ref<Person[]>(load())

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []

      const parsed = JSON.parse(raw)
      return parsed
    } catch (e) {
      return []
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(people.value))
  }

  function moveBackToPending(newPeople: Person[]) {
    people.value.push(...newPeople)
  }

  return { people, save, moveBackToPending }
}

const FAKER = [
  { name: 'John Smith' },
  { name: 'Emma Johnson' },
  { name: 'Liam Brown' },
  { name: 'Olivia Williams' },
  { name: 'Noah Jones' },
  { name: 'Ava Garcia' },
  { name: 'Lucas Miller' },
  { name: 'Mia Davis' },
  { name: 'Ethan Rodriguez' },
  { name: 'Sophia Martinez' },
  { name: 'Mason Hernandez' },
  { name: 'Isabella Lopez' },
  { name: 'Logan Gonzalez' },
  { name: 'Amelia Wilson' },
  { name: 'James Anderson' },
  { name: 'Harper Thomas' },
  { name: 'Benjamin Taylor' },
  { name: 'Evelyn Moore' },
  { name: 'Elijah Jackson' },
  { name: 'Abigail Martin' },
  { name: 'John Smith' },
  { name: 'Emma Johnson' },
  { name: 'Liam Brown' },
  { name: 'Olivia Williams' },
  { name: 'Noah Jones' },
  { name: 'Ava Garcia' },
  { name: 'Lucas Miller' },
  { name: 'Mia Davis' },
  { name: 'Ethan Rodriguez' },
  { name: 'Sophia Martinez' },
  { name: 'Mason Hernandez' },
  { name: 'Isabella Lopez' },
  { name: 'Logan Gonzalez' },
  { name: 'Amelia Wilson' },
  { name: 'James Anderson' },
  { name: 'Harper Thomas' },
  { name: 'Benjamin Taylor' },
  { name: 'Evelyn Moore' },
  { name: 'Elijah Jackson' },
  { name: 'Abigail Martin' },

  { name: 'John Smith' },
  { name: 'Emma Johnson' },
  { name: 'Liam Brown' },
  { name: 'Olivia Williams' },
  { name: 'Noah Jones' },
  { name: 'Ava Garcia' },
  { name: 'Lucas Miller' },
  { name: 'Mia Davis' },
  { name: 'Ethan Rodriguez' },
  { name: 'Sophia Martinez' },
  { name: 'Mason Hernandez' },
  { name: 'Isabella Lopez' },
  { name: 'Logan Gonzalez' },
  { name: 'Amelia Wilson' },
  { name: 'James Anderson' },
  { name: 'Harper Thomas' },
  { name: 'Benjamin Taylor' },
  { name: 'Evelyn Moore' },
  { name: 'Elijah Jackson' },
  { name: 'Abigail Martin' },
  { name: 'John Smith' },
  { name: 'Emma Johnson' },
  { name: 'Liam Brown' },
  { name: 'Olivia Williams' },
  { name: 'Noah Jones' },
  { name: 'Ava Garcia' },
  { name: 'Lucas Miller' },
  { name: 'Mia Davis' },
  { name: 'Ethan Rodriguez' },
  { name: 'Sophia Martinez' },
  { name: 'Mason Hernandez' },
  { name: 'Isabella Lopez' },
  { name: 'Logan Gonzalez' },
  { name: 'Amelia Wilson' },
  { name: 'James Anderson' },
  { name: 'Harper Thomas' },
  { name: 'Benjamin Taylor' },
  { name: 'Evelyn Moore' },
  { name: 'Elijah Jackson' },
  { name: 'Abigail Martin' },
  { name: 'John Smith' },
  { name: 'Emma Johnson' },
  { name: 'Liam Brown' },
  { name: 'Olivia Williams' },
  { name: 'Noah Jones' },
  { name: 'Ava Garcia' },
  { name: 'Lucas Miller' },
  { name: 'Mia Davis' },
  { name: 'Ethan Rodriguez' },
  { name: 'Sophia Martinez' },
  { name: 'Mason Hernandez' },
  { name: 'Isabella Lopez' },
  { name: 'Logan Gonzalez' },
  { name: 'Amelia Wilson' },
  { name: 'James Anderson' },
  { name: 'Harper Thomas' },
  { name: 'Benjamin Taylor' },
  { name: 'Evelyn Moore' },
  { name: 'Elijah Jackson' },
  { name: 'Abigail Martin' },
  { name: 'John Smith' },
  { name: 'Emma Johnson' },
  { name: 'Liam Brown' },
  { name: 'Olivia Williams' },
  { name: 'Noah Jones' },
  { name: 'Ava Garcia' },
  { name: 'Lucas Miller' },
  { name: 'Mia Davis' },
  { name: 'Ethan Rodriguez' },
  { name: 'Sophia Martinez' },
  { name: 'Mason Hernandez' },
  { name: 'Isabella Lopez' },
  { name: 'Logan Gonzalez' },
  { name: 'Amelia Wilson' },
  { name: 'James Anderson' },
  { name: 'Harper Thomas' },
  { name: 'Benjamin Taylor' },
  { name: 'Evelyn Moore' },
  { name: 'Elijah Jackson' },
  { name: 'Abigail Martin' },
  { name: 'John Smith' },
  { name: 'Emma Johnson' },
  { name: 'Liam Brown' },
  { name: 'Olivia Williams' },
  { name: 'Noah Jones' },
  { name: 'Ava Garcia' },
  { name: 'Lucas Miller' },
  { name: 'Mia Davis' },
  { name: 'Ethan Rodriguez' },
  { name: 'Sophia Martinez' },
  { name: 'Mason Hernandez' },
  { name: 'Isabella Lopez' },
  { name: 'Logan Gonzalez' },
  { name: 'Amelia Wilson' },
  { name: 'James Anderson' },
  { name: 'Harper Thomas' },
  { name: 'Benjamin Taylor' },
  { name: 'Evelyn Moore' },
  { name: 'Elijah Jackson' },
  { name: 'Abigail Martin' },
  { name: 'John Smith' },
  { name: 'Emma Johnson' },
  { name: 'Liam Brown' },
  { name: 'Olivia Williams' },
  { name: 'Noah Jones' },
  { name: 'Ava Garcia' },
  { name: 'Lucas Miller' },
  { name: 'Mia Davis' },
  { name: 'Ethan Rodriguez' },
  { name: 'Sophia Martinez' },
  { name: 'Mason Hernandez' },
  { name: 'Isabella Lopez' },
  { name: 'Logan Gonzalez' },
  { name: 'Amelia Wilson' },
  { name: 'James Anderson' },
  { name: 'Harper Thomas' },
  { name: 'Benjamin Taylor' },
  { name: 'Evelyn Moore' },
  { name: 'Elijah Jackson' },
  { name: 'Abigail Martin' },
].map((p, i) => ({
  ...p,
  id: i + 1,
}))
