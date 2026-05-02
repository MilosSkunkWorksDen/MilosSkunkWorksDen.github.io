<script setup lang="ts">
import type { Table } from '@/composables/useTables'
import { ChevronRight } from '@lucide/vue'
import draggable from 'vuedraggable'
import Person from './Person.vue'
import Button from './ui/button/Button.vue'
import { Trash } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { ref } from 'vue'

const isOpen = defineModel('open', {
  default: true,
})

const props = defineProps<{
  table: Table
}>()

defineEmits(['delete', 'update'])

const isEditingName = ref(false)
</script>

<template>
  <div class="px-4 py-2 my-2 rounded-lg shadow-sm border border-neutral-50 relative">
    <div class="flex items-center justify-between">
      <div class="flex gap-2 items-center">
        <ChevronRight
          @click="isOpen = !isOpen"
          class="size-4 transition-transform duration-200 cursor-pointer"
          :class="{ 'rotate-90': isOpen }"
        />

        <Input
          v-if="isEditingName"
          type="email"
          placeholder="Email"
          :default-value="table.name"
          class="h-4!"
        />
        <span v-if="!isEditingName" @click.stop.prevent="isEditingName = true">
          {{ table.name }}
        </span>
      </div>

      <div class="flex items-center justify-center gap-2 text-xs">
        <Button @click="$emit('delete', $event)" variant="destructive" size="icon-sm">
          <Trash></Trash>
        </Button>
      </div>
    </div>

    <div v-if="isOpen" class="mt-2 border border-neutral-200 border-dashed rounded-lg relative">
      <draggable
        v-model="table.people"
        group="assign-people-to-tables"
        item-key="name"
        drag-class="draggable-person-drag"
        ghost-class="draggable-person-ghost"
        chosen-class="draggable-person-chosen"
        class="min-h-12 p-2"
      >
        <template #item="{ element, index }">
          <div class="item">
            <Person :person="element" :key="element.name" />
          </div>
        </template>
      </draggable>

      <div
        v-if="table.people.length === 0"
        class="text-xs text-neutral-400 absolute left-1/2 -translate-x-1/2"
        :class="[table.people.length === 0 ? 'top-1/2 -translate-y-1/2' : 'bottom-1']"
      >
        Drag & Drop Person
      </div>
    </div>
    <div
      class="flex items-center justify-center gap-1 text-xs"
      :class="[isOpen ? 'mt-2' : 'absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2']"
    >
      <span> Count:</span> {{ table.people.length ?? 0 }}
    </div>
  </div>
</template>
