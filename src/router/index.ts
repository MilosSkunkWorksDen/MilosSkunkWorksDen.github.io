import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AssignerView from '../views/AssignerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AssignerView,
    },
    {
      path: '/people',
      name: 'people',
      component: () => import('../views/PeopleView.vue'),
    },
    {
      path: '/canvas',
      name: 'canvas',
      component: () => import('../views/AssignerCanvasView.vue'),
    },
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView,
    // },
  ],
})

export default router
