<script setup lang="ts">
import type { Person } from '@/composables/usePeople'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserColor } from '@/composables/useUserColor'
import { computed } from 'vue'

const props = defineProps<{
  person: Person
}>()

const userColors = computed(() => getUserColor(String(props.person?.id ?? 'Deleted user')))

// const avatarUrl = (id: number) => `https://api.dicebear.com/7.x/adventurer/svg?seed=${id}`
const avatarUrl = (id: number) => ``
</script>

<template>
  <div class="flex-1 flex gap-1 cursor-pointer hover:bg-neutral-50 px-2 py-1 rounded-md border">
    <Avatar class="size-9">
      <AvatarImage :src="avatarUrl(person.id)" />
      <AvatarFallback
        class="border bg-transparent font-medium"
        :style="{
          borderColor: userColors.color_light,
          color: userColors.color_light,
        }"
        >{{ person.id }}</AvatarFallback
      >
    </Avatar>

    <div class="ml-1">
      <div class="text-sm">{{ person.name }}</div>
      <div class="text-xs text-muted-foreground">
        {{ person.group || '-' }}
      </div>
    </div>
  </div>
</template>

<style></style>
