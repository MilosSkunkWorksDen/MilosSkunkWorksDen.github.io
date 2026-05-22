<script setup lang="ts">
import { Import, Plus, Upload } from 'lucide-vue-next'
import type { LucideIcon } from '@lucide/vue'
import { computed, type HTMLAttributes, type HtmlHTMLAttributes } from 'vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useRoute } from 'vue-router'
import type { PrimitiveProps } from 'reka-ui'
import type { ButtonVariants } from '../ui/button'
import ConfirmDialog from './ConfirmDialog.vue'
import Button from '../ui/button/Button.vue'

function handleImport(file: File | null): void {
  if (!file) return

  const reader = new FileReader()

  reader.onload = (event) => {
    try {
      const text = event.target?.result as string
      console.log(text, event.target)

      const data = JSON.parse(text)

      localStorage.setItem('tables', JSON.stringify(data.state.tables))
      localStorage.setItem('db_people', JSON.stringify(data.state.db_people))
      localStorage.setItem('project_name', data.project_name)

      window.location.href = '/'
    } catch (err) {
      console.error('Invalid JSON file', err)
      alert('Invalid JSON file')
    }
  }

  reader.readAsText(file)
}
</script>

<template>
  <ConfirmDialog @confirmed="handleImport">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="ghost" class="size-6!" size="icon-sm">
            <Upload class="size-4!"></Upload>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" align="center">
          <p>{{ 'Import Project' }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </ConfirmDialog>
</template>
