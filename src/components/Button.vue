<script setup lang="ts">
defineEmits(['click'])
</script>

<template>
  <button
    v-bind="$attrs"
    @click="$emit('click')"
    class="h-10 px-8 text-base font-medium rounded-md shadow-lg bg-primary text-white hover:bg-primary/90 transition-all duration-200 flex items-center gap-2"
  >
    <slot />
  </button>
</template>
