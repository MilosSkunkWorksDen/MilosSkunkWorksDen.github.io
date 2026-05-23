<script setup lang="ts">
import type { Person } from '@/composables/usePeople'
import { cardStyle, cardTextStyle } from './utils'

defineProps<{
  person: Person & {
    label: string
    card: { x: number; y: number; width: number; height: number }
  }
}>()
</script>

<template>
  <v-group :config="{ x: person.card.x, y: person.card.y }">
    <v-rect
      :config="{ ...cardStyle(false), width: person.card.width, height: person.card.height }"
    />
    <v-text
      :config="{
        ...cardTextStyle,
        text: person.label,
        width: person.card.width,
        height: person.card.height,
      }"
    />
  </v-group>
</template>
