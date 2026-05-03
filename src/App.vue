<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import router from './router'
import { Camera, Home, Info, InfoIcon, Table, Users } from '@lucide/vue'
import Link from './components/Link.vue'
import SidebarNavigation from './components/SidebarNavigation.vue'
</script>

<template>
  <div class="flex bg-background">
    <div id="sidebar" class="flex flex-col min-w-42 p-2 gap-4">
      <Link to="/assigner" class="px-4 py-2">
        <div class="flex gap-4">
          <Table class="bg-black rounded-md text-white p-1 size-7" />
          <span> Table Assigner </span>
        </div>
      </Link>

      <div>
        <div class="px-2 text-xs h-8 text-black/60 flex justify-start items-center">Platform</div>
        <div class="text-sm flex flex-col gap-1 px-2">
          <SidebarNavigation href="/" title="Home" :icon="Home" />
          <SidebarNavigation href="/people" title="People" :icon="Users" />
        </div>
      </div>
    </div>

    <main class="flex-1 p-1 min-h-svh">
      <div class="bg-white min-h-full rounded-xl shadow-sm overflow-hidden flex flex-col">
        <RouterView />
      </div>
    </main>
  </div>
</template>
