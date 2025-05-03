import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '@/views/Error/index.vue'
import { useUserStore } from '@/stores'
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

router.beforeEach((to) => {
  const userStore = useUserStore()
  if (to.path !== '/login' && !userStore.token) {
    return '/login'
  }
  if (userStore.token && userStore.userMenu.length === 0) {
    userStore.getUserMenu()
  }
})
export default router
