<script setup lang="ts">
import { computed } from 'vue'
import type { CircleTable } from './types'
import useTableGeometry from '@/composables/useTableGeometry'
import { tableStyle } from './utils'
import CanvasPersonCard from './CanvasPersonCard.vue'

const { generateSeatingGrid, offsetUserCardCoordinates } = useTableGeometry()
const card_width = 150
const card_height = 30

const props = defineProps<{
  baseTable: CircleTable
  hoveredId?: CircleTable['id']
  selectedId?: CircleTable['id']
}>()

const table = computed(() => {
  const t = props.baseTable

  const seating = generateSeatingGrid(t, (card_height * 3) / 4, card_height)

  return {
    ...t,
    seating,
    people: t.people.map((p, index) => {
      const seat = seating.seats[index]!
      const card = offsetUserCardCoordinates(seat, t, card_width, card_height)

      return {
        ...p,
        label: index + 1 + '. ' + p.name, // + '\n ' + `${seat.x.toFixed(2)} _ ${seat.y.toFixed(2)}`,
        seat,
        card: {
          ...card,
          height: card_height,
          width: card_width,
        },
      }
    }),
  }
})

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <v-circle
    v-bind="$attrs"
    :config="{
      elType: 'table',
      id: `table-${table.id}`,
      table: table,
      x: table.x,
      y: table.y,
      radius: table.width / 2,
      ...tableStyle(hoveredId == table.id),
      // draggable: true,
    }"
  />

  <v-text
    :config="{
      text: `${table.name}\n Count: ${table.people.length}`,
      x: table.x - table.width / 2,
      y: table.y - 10,
      width: table.width,
      align: 'center',
      fontSize: 15,
      fill: '#334155',
      listening: false,
    }"
  />

  <CanvasPersonCard v-for="(person, index) in table.people" :key="person.id" :person="person" />

  <!-- <v-group
            :config="{
              listening: false,
            }"
          >
            <v-circle
              :config="{
                ...table.seating.ring,
                stroke: 'rgba(0,0,0,0.05)',
                strokeWidth: 1,
                fill: 'transparent',
              }"
            />
            <v-circle
              v-for="(dot, i) in table.seating.seats"
              :key="i"
              :config="{
                ...dot,
                radius: 1,
                fill: 'rgba(255, 0, 0, 0.5)',
              }"
            />
          </v-group> -->
</template>
