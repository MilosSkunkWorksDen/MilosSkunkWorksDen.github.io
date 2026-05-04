<script setup lang="ts">
import Link, { type Props as LinkProps } from './Link.vue'
import type { LucideIcon } from '@lucide/vue'
import { computed, type HtmlHTMLAttributes } from 'vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Button from './ui/button/Button.vue'
import { useRoute } from 'vue-router'

interface Props {
  icon?: LucideIcon
  href: LinkProps['to']
  title: string
  active?: boolean
  activeClass?: HtmlHTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  active: undefined,
})

const route = useRoute()

const isActive = computed(() => {
  return props.active !== undefined ? props.active : route.path == props.href
})
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <div>
          <Link
            :to="href"
            class="flex gap-2 items-center hover:bg-sidebar-accent p-2 rounded-md h-8"
            :class="[isActive ? activeClass || 'bg-sidebar-accent' : '']"
          >
            <component v-if="icon" :is="icon" class="size-4" />
          </Link>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" align="center">
        <p>{{ title }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  <!-- 
  <Tooltip>
    <TooltipTrigger as-child>
      
    </TooltipTrigger>
    <TooltipContent>
      <p>{{ title }}</p>
    </TooltipContent>
  </Tooltip> -->
</template>
