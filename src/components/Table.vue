<script setup lang="ts">
import type { Table } from '@/composables/useTables'
import { Check, ChevronRight, X } from '@lucide/vue'
import draggable from 'vuedraggable'
import PersonComponent from './Person.vue'
import Button from './ui/button/Button.vue'
import { Trash } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { nextTick, ref, watch } from 'vue'

const isOpen = defineModel('open', {
  default: true,
})

const props = defineProps<{
  table: Table
}>()

const name = ref(props.table.name)

const emit = defineEmits(['delete', 'update'])

function handleSubmit() {
  emit('update', {
    ...props.table,
    name: name,
  })

  isEditingName.value = false
}

const isEditingName = ref(false)

const nameInput = ref<HTMLInputElement | null>(null)

watch(isEditingName, async (val) => {
  if (val) {
    await nextTick()
    nameInput.value?.focus()
  }
})

function handlePeopleChange(evt: { added?: any; removed?: any }) {
  emit('update', props.table)
}
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
        <div v-if="isEditingName" class="flex gap-1 items-center">
          <Input
            ref="nameInput"
            @keydown.enter="handleSubmit"
            type="name"
            placeholder="Name"
            v-model="name"
            class="h-8! text-base!"
          />
          <Check class="size-5 cursor-pointer text-green-400" @click="handleSubmit" />
          <X class="size-5 cursor-pointer text-red-400" @click="isEditingName = false" />
        </div>
        <span
          v-if="!isEditingName"
          @click.stop.prevent="isEditingName = true"
          class="cursor-pointer hover:bg-neutral-100 py-1 px-2 rounded-md"
        >
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
        @change="handlePeopleChange"
      >
        <template #item="{ element, index }">
          <div class="item my-1">
            <PersonComponent :person="element" :key="element.name" />
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
