<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import Button from '../ui/button/Button.vue'
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'confirmed', file: File | null): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)

function openFilePicker() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  selectedFile.value = file

  // reset so same file can be selected again
  target.value = ''
}

function confirm() {
  emit('confirmed', selectedFile.value)
}
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger>
      <slot />
    </AlertDialogTrigger>

    <AlertDialogContent class="sm:max-w-md">
      <AlertDialogHeader>
        <AlertDialogTitle> Load existing project </AlertDialogTitle>

        <AlertDialogDescription>
          Import a previously exported project file (.json). Your current project will be replaced
          with the the imported data.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div class="flex gap-3 items-center py-4">
        <Button class="" @click="openFilePicker"> Upload JSON </Button>
        <input
          ref="fileInput"
          type="file"
          accept="application/json,.json"
          class="hidden"
          @change="handleFileChange"
        />
        <div v-if="selectedFile" class="text-sm text-muted-foreground">
          <span class="font-medium text-foreground">{{ selectedFile.name }}</span>
        </div>
      </div>

      <AlertDialogFooter>
        <AlertDialogCancel> Cancel </AlertDialogCancel>

        <AlertDialogAction
          :disabled="!selectedFile"
          class="bg-primary text-primary-foreground"
          @click="confirm"
        >
          Import Project
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
