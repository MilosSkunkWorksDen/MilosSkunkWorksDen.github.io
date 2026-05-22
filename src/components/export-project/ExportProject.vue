<script setup lang="ts">
import { Download, Plus } from 'lucide-vue-next'
import type { LucideIcon } from '@lucide/vue'
import { computed, type HTMLAttributes, type HtmlHTMLAttributes } from 'vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useRoute } from 'vue-router'
import type { PrimitiveProps } from 'reka-ui'
import type { ButtonVariants } from '../ui/button'
import Button from '../ui/button/Button.vue'

function flush() {
  localStorage.removeItem('tables')
  localStorage.removeItem('db_people')
  window.location.reload()
}

function downloadJson(data: any, filename = 'export.json') {
  const jsonString = JSON.stringify(data, null, 2)

  const blob = new Blob([jsonString], {
    type: 'application/json',
  })

  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

function handle() {
  const project_name = localStorage.getItem('project_name')
  const filename = prompt(
    'Enter export file name',
    project_name == 'null' || !project_name ? 'table-assigner' : project_name,
  )

  if (filename) {
    const tables = localStorage.getItem('tables')
    const db_people = localStorage.getItem('db_people')

    const exportData = {
      project_name,
      state: {
        tables: tables ? JSON.parse(tables) : {},
        db_people: db_people ? JSON.parse(db_people) : {},
      },
    }

    downloadJson(exportData, `${filename}.json`)
  }
}
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button @click="handle" variant="ghost" class="size-6!" size="icon-sm">
          <Download class="size-4!" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" align="center">
        <p>{{ 'Export Project' }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
