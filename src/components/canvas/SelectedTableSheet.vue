<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { CanvasTable } from './types'
import { ref, watch } from 'vue'

const open = defineModel('open', { default: false })

const props = defineProps<{
  table?: CanvasTable
}>()

const form = ref({
  name: props.table?.name,
})

watch(
  () => props.table,
  (t) => {
    form.value = {
      name: t?.name,
    }
  },
)

const emit = defineEmits<{
  (e: 'updateTable', table: CanvasTable): void
}>()
</script>

<template>
  <Sheet v-model:open="open">
    <SheetTrigger as-child>
      <!-- <Button variant="outline"> Open </Button> -->
    </SheetTrigger>
    <SheetContent overlay-class="bg-transparent!" @open-auto-focus="(e) => e.preventDefault()">
      <SheetHeader>
        <SheetTitle>Edit Table</SheetTitle>
        <SheetDescription>
          Make changes to your table here. Click save when you're done.
        </SheetDescription>
      </SheetHeader>
      <div class="grid flex-1 auto-rows-min gap-6 px-4">
        <div class="grid gap-3">
          <Label for="table-name">Name</Label>
          <Input id="table-name" v-model="form.name" />
        </div>
      </div>
      <SheetFooter>
        <Button
          type="submit"
          @click="
            () => {
              if (table) {
                $emit('updateTable', { ...table, ...form } as any)
              }
            }
          "
        >
          Save changes
        </Button>
        <SheetClose as-child>
          <Button variant="outline"> Close </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
