<script setup lang="ts">
import usePeople from '@/composables/usePeople'

const { people } = usePeople()
</script>

<template>
  <div class="flex-1 flex">
    <div class="p-4 border-r border-neutral-100 flex flex-col gap-4 w-84">
      <div class="text-lg">Assign People To Tables</div>

      <div class="flex-1 flex flex-col">
        <div class="text-xs text-black/60 mb-2">People</div>
        <div class="flex-1 flex flex-col gap-1">
          <div v-for="p in people">
            {{ p.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
