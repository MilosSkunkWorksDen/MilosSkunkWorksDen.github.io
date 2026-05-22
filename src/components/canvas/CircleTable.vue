<script setup lang="ts">
import { computed } from 'vue'
import type { CircleTable } from './types'
import useTableGeometry from '@/composables/useTableGeometry'

const { generateSeatingGrid, offsetUserCardCoordinates } = useTableGeometry()
const card_width = 150
const card_height = 30

const emit = defineEmits<{
  (e: 'dragmove', event: any): void
  (e: 'dragend', event: any): void
}>()

const props = defineProps<{
  circleTable: CircleTable
  hoverId?: CircleTable['id']
}>()

const baseTableStyle = {
  fill: '#ffffff',
  stroke: '#CBD5E1',
  strokeWidth: 1.5,
  shadowColor: 'rgba(0,0,0,0.08)',
  shadowBlur: 10,
  shadowOffsetY: 4,
  cornerRadius: 10,
}

const table = computed(() => {
  const t = props.circleTable

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
</script>

<template>
  <v-circle
    :config="{
      table: table,
      x: table.x,
      y: table.y,
      radius: table.width / 2,
      fill: baseTableStyle.fill,
      stroke: baseTableStyle.stroke,
      strokeWidth: 1.5,
      shadowBlur: hoverId === table.id ? 14 : 8,
      shadowOpacity: 0.1,
      draggable: true,
    }"
    @dragmove="$emit('dragmove', $event)"
    @dragend="$emit('dragend', $event)"
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

  <v-group
    v-for="(person, index) in table.people"
    :key="person.id"
    :config="{
      x: person.card.x,
      y: person.card.y,
    }"
  >
    <v-rect
      :config="{
        width: person.card.width,
        height: person.card.height,
        fill: 'white',
        stroke: '#e2e8f0',
        cornerRadius: 6,
        shadowBlur: 10,
        shadowOpacity: 0.2,
      }"
    />
    <v-text
      :config="{
        text: person.label,
        fontSize: 12,
        fill: '#334155',
        width: person.card.width,
        height: person.card.height,
        align: 'center',
        verticalAlign: 'middle',
      }"
    />
  </v-group>

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
