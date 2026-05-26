<script setup lang="ts">
import { computed } from 'vue'
import type { RectTable } from './types'
import useTableGeometry from '@/composables/useTableGeometry'
import { tableStyle, tableTextStyle } from './utils'
import CanvasPersonCard from './CanvasPersonCard.vue'
import { useKonvaIcon, USERS_SVG } from '@/composables/useKonvaIcon'

const usersIcon = useKonvaIcon(USERS_SVG)

const { generateSeatingGrid, offsetUserCardCoordinates } = useTableGeometry()
const card_width = 150
const card_height = 30

const props = defineProps<{
  baseTable: RectTable
  hoveredId?: RectTable['id']
  selectedId?: RectTable['id']
}>()

const table = computed(() => {
  const t = props.baseTable

  const seating = generateSeatingGrid({ ...t, x: 0, y: 0 }, (card_height * 3) / 4, card_height)

  return {
    ...t,
    seating,
    people: t.people.map((p, index) => {
      const seat = seating.seats[index]!
      const card = offsetUserCardCoordinates(seat, t, card_width, card_height)

      return {
        ...p,
        label: p.name, // + '\n ' + `${seat.x.toFixed(2)} _ ${seat.y.toFixed(2)}`,
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
  <v-rect
    v-bind="$attrs"
    :config="{
      elType: 'table',
      id: `table-${table.id}`,
      table: table,
      width: table.width,
      height: table.height,
      offsetX: table.width / 2,
      offsetY: table.height / 2,
      ...tableStyle(hoveredId == table.id),
      // draggable: true,
    }"
  />

  <v-text
    :config="{
      text: table.name,
      width: table.width,
      x: -table.width / 2,
      y: -10,
      ...tableTextStyle(hoveredId == table.id),
      listening: false,
    }"
  />

  <v-image
    v-if="!table.without_people"
    :config="{
      image: usersIcon,
      width: 15,
      height: 15,
      x: -20,
      y: 16,
      listening: false,
    }"
  />

  <v-text
    v-if="!table.without_people"
    :config="{
      text: `${table.people.length}`,
      fontSize: 15,
      fill: '#334155',
      x: 0,
      y: 16,
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
