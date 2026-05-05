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

defineEmits(['confirmed'])
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger> <slot /></AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle class="">Start New Project ?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your data and start a clean
          project.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          class="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
          @click="$emit('confirmed')"
          >Confirm</AlertDialogAction
        >
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
