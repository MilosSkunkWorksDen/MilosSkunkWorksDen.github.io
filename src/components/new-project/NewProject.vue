<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import Link, { type Props as LinkProps } from './Link.vue'
import type { LucideIcon } from '@lucide/vue'
import { computed, type HTMLAttributes, type HtmlHTMLAttributes } from 'vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Button from './ui/button/Button.vue'
import { useRoute } from 'vue-router'
import type { PrimitiveProps } from 'reka-ui'
import type { ButtonVariants } from '../ui/button'

function flush() {
  if (confirm('All data will be lost')) {
    localStorage.removeItem('tables')
    localStorage.removeItem('db_people')
    window.location.reload()
  }
}
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button @click="flush" variant="ghost" class="size-6!" size="icon-sm">
          <Plus class="size-4!"></Plus>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" align="center">
        <p>{{ 'Start New Project' }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
