import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '@/views/Error/index.vue'
import { useUserStore } from '@/stores'
import NProgress from 'nprogress'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      meta: { title: '首页' },
      children: [
        {
          path: ''
        }
      ]
    },
    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: { title: '出错了' }
    }
  ]
})

router.beforeEach((to) => {
  NProgress.start()
  const userStore = useUserStore()
  if (to.path !== '/login' && !userStore.token) {
    return '/login'
  }
  if (userStore.token && userStore.userMenu.length === 0) {
    userStore.getUserMenu()
  }
  let title = (to.meta.title || '') + ' - LEOLEOQiuuu'
  document.title = title
})

router.afterEach(() => {
  NProgress.done()
})

export default router
