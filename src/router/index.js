import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '@/views/Error/index.vue'
import { useUserStore } from '@/stores'
import NProgress from 'nprogress'

const routes = [
  {
    path: '/',
    name: 'admin',
    component: () => import('@/views/layout/index.vue'),
    meta: { title: '首页' }
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
//动态路由
const asyncRoutes = [
  {
    path: '/',
    name: '/',
    component: () => import('@/views/home/index.vue'),
    meta: { title: '后台首页' }
  },
  {
    path: '/goods/list',
    name: 'goods-list',
    component: () => import('@/views/Manage/index.vue'),
    meta: { title: '商品列表' }
  }
]

const addRoute = (menu) => {
  let hasNewRoute = false
  function findAndAddRoute(arr) {
    arr.forEach((item) => {
      const element = asyncRoutes.find((e) => e.path === item.frontpath)
      if (element && !router.hasRoute(element.path)) {
        router.addRoute('admin', element)
        hasNewRoute = true
      }
      if (item.child && item.child.length > 0) {
        findAndAddRoute(item.child)
      }
    })
    return hasNewRoute
  }
  findAndAddRoute(menu)
  console.log(router.getRoutes())
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  NProgress.start()
  const userStore = useUserStore()
  if (to.path !== '/login' && !userStore.token) {
    return '/login'
  }
  let hasNewRoute = false
  if (userStore.token) {
    await userStore.getUserMenu()
    addRoute(userStore.userMenu.menus)
    hasNewRoute = userStore.userMenu.length > 0
  }
  let title = (to.meta.title || '') + ' - LEOLEOQiuuu'
  document.title = title
  //动态路由只能注册，所以要用push或者replace
  if (hasNewRoute) {
    return to.fullPath
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
