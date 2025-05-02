import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '@/views/Error/index.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/index.vue')
    },
    {
      path: '/login',
      component: () => import('@/views/login/index.vue')
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
  ]
})

export default router
