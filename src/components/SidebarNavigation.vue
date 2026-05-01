<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { RouterLinkProps } from 'vue-router'
import Link, { type Props as LinkProps } from './Link.vue'
import type { LucideIcon } from '@lucide/vue'

interface Props {
  icon?: LucideIcon
  href: LinkProps['to']
  title: string
}

defineProps<Props>()
</script>

<template>
  <Link :to="href" class="flex gap-2 items-center hover:bg-neutral-100 p-2 rounded-md h-8">
    <component v-if="icon" :is="icon" class="size-4" />

    <span class="flex flex-1 justify-between text-sm">
      <span>{{ title }}</span>
    </span>
  </Link>
</template>
