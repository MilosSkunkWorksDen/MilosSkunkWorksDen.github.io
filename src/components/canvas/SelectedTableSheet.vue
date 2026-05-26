<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CanvasTable } from './types'
import { ref, watch, type HtmlHTMLAttributes } from 'vue'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Trash, X } from 'lucide-vue-next'
import PersonComponent from '../Person.vue'
import draggable from 'vuedraggable'

const props = withDefaults(
  defineProps<{
    class?: HtmlHTMLAttributes['class']
    table?: CanvasTable
    side?: string
    open: boolean
  }>(),
  {
    side: 'right',
    open: false,
  },
)

const form = ref({
  name: props.table?.name,
  without_people: props.table?.without_people ?? false,
})

watch(
  () => props.table,
  (t) => {
    form.value = {
      name: t?.name,
      without_people: t?.without_people || false,
    }
  },
)

const emit = defineEmits<{
  (e: 'updateTable', table: CanvasTable, ev?: { added?: any; removed?: any }): void
  (e: 'close'): void
}>()

const close = () => emit('close')

function handlePeopleChange(evt: { added?: any; removed?: any }) {
  if (props.table) {
    emit('updateTable', props.table, evt)
  }
}
</script>

<template>
  <Card
    v-show="open"
    :data-state="open ? 'open' : 'closed'"
    class="w-full max-w-sm justify-between rounded-none rounded-l-xl"
    :class="
      cn(
        'bg-white data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
        side === 'right' &&
          'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
        side === 'left' &&
          'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
        side === 'top' &&
          'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
        side === 'bottom' &&
          'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
        props.class,
      )
    "
  >
    <Button @click="close" class="absolute top-2 right-2" variant="ghost" size="icon-sm">
      <X />
    </Button>

    <template v-if="table">
      <CardHeader>
        <CardTitle>Edit Table</CardTitle>
        <CardDescription>
          Make changes to your table here. Click save when you're done.
        </CardDescription>
        <CardAction> </CardAction>
      </CardHeader>
      <CardContent class="px-0! flex-1 overflow-hidden">
        <form class="h-full w-full flex flex-col gap-4">
          <div class="px-6 flex flex-col space-y-1.5">
            <Label for="table-name">Name</Label>
            <Input id="table-name" v-model="form.name" />
          </div>
          <div :class="['px-6 flex items-center space-x-2']">
            <Label
              for="without-people"
              :class="{ 'opacity-50 cursor-not-allowed': table.people.length > 0 }"
              >Without People</Label
            >
            <Switch
              :disabled="table.people.length > 0"
              v-model="form.without_people"
              id="without-people"
            />
          </div>

          <div class="pl-4 flex-1 flex flex-col overflow-y-auto scrollbar-thin pb-1">
            <draggable
              v-model="table.people"
              item-key="name"
              class=""
              drag-class="draggable-person-drag"
              ghost-class="draggable-person-ghost"
              chosen-class="draggable-person-chosen"
              group="assign-people-to-tables"
              @change="handlePeopleChange"
            >
              <template #item="{ element, index }">
                <div class="item relative hover:bg-neutral-50">
                  <PersonComponent class="pr-6" :person="element" :key="element.name" />
                  <Trash
                    @click="handlePeopleChange({ removed: { element } })"
                    class="size-4 absolute right-2 top-1/2 -translate-y-1/2 text-destructive cursor-pointer"
                  />
                </div>
              </template>
            </draggable>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex flex-col gap-2">
        <Button
          class="w-full"
          type="submit"
          @click="() => table && $emit('updateTable', { ...table, ...form } as any)"
        >
          Save
        </Button>
        <!-- <Button @click="close" class="w-full" variant="outline"> Close </Button> -->
      </CardFooter>
    </template>
    <template v-else>
      <CardHeader>
        <CardTitle>No Table Selected</CardTitle>
        <CardDescription> Select a table to start editing. </CardDescription>
      </CardHeader>
      <CardContent
        class="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground"
      >
        <p class="text-sm">No table selected</p>
      </CardContent>
    </template>
  </Card>
</template>
