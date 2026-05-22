<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import router from './router'
import { Camera, Home, Info, InfoIcon, Table, Users } from '@lucide/vue'
import Link from './components/Link.vue'
import SidebarNavigation from './components/SidebarNavigation.vue'
import { LayoutGrid, NotebookText, NotepadText, PenTool } from 'lucide-vue-next'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from './components/ui/button'
import NewProject from './components/new-project/NewProject.vue'
import ExportProject from './components/export-project/ExportProject.vue'
import ImportProject from './components/import-project/ImportProject.vue'
</script>

<template>
  <div class="flex bg-sidebar overflow-hidden">
    <div id="sidebar" class="flex flex-col p-2 gap-4">
      <Link to="/" class="px-2 py-2">
        <div class="flex gap-4 items-center justify-center">
          <NotebookText class="bg-primary rounded-md text-white p-1 size-7" />
          <!-- <span> Table Assigner </span> -->
        </div>
      </Link>

      <div>
        <!-- <div class="px-2 text-xs h-8 text-black/60 flex justify-start items-center">Platform</div> -->
        <div class="text-sm flex flex-col gap-1 px-2 items-center">
          <SidebarNavigation href="/" title="Seating Assignments" :icon="LayoutGrid" />
          <SidebarNavigation href="/people" title="People" :icon="Users" />
          <SidebarNavigation href="/canvas" title="Canvas" :icon="PenTool" />
        </div>
      </div>
    </div>

    <main class="flex-1 p-1 pl-0 min-h-svh overflow-hidden">
      <div class="bg-white min-h-full rounded-xl shadow-sm overflow-hidden flex flex-col">
        <RouterView />
      </div>
    </main>

    <div class="fixed bottom-2 left-5 flex flex-col justify-center items-center gap-2">
      <ExportProject />
      <ImportProject />
      <NewProject />
    </div>
  </div>
</template>
