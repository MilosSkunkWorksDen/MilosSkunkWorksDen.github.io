<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import Link, { type Props as LinkProps } from './Link.vue'
import type { LucideIcon } from '@lucide/vue'
import { computed, type HTMLAttributes, type HtmlHTMLAttributes } from 'vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useRoute } from 'vue-router'
import type { PrimitiveProps } from 'reka-ui'
import type { ButtonVariants } from '../ui/button'
import ConfirmDialog from './ConfirmDialog.vue'
import Button from '../ui/button/Button.vue'

function flush() {
  localStorage.removeItem('tables')
  localStorage.removeItem('db_people')
  window.location.reload()
}
</script>

<template>
  <ConfirmDialog @confirmed="flush">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="ghost" class="size-6!" size="icon-sm">
            <Plus class="size-4!"></Plus>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" align="center">
          <p>{{ 'New Project' }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </ConfirmDialog>
</template>
