<script setup lang="ts">
import type { HtmlHTMLAttributes } from 'vue'
import { RouterLink } from 'vue-router'
import type { RouterLinkProps } from 'vue-router'

export interface Props extends RouterLinkProps {
  to: string
  variant?: 'primary' | 'secondary'
  class: HtmlHTMLAttributes['class']
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <RouterLink
    v-bind="$props"
    :class="[
      'base-link',
      variant === 'primary' && 'text-blue-600',
      variant === 'secondary' && 'text-gray-500',
      props.class,
    ]"
  >
    <slot />
  </RouterLink>
</template>
