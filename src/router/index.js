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
    component: () => import('@/views/Goods/index.vue'),
    meta: { title: '商品' }
  },
  {
    path: '/order/list',
    name: 'order/list',
    component: () => import('@/views/Order/index.vue'),
    meta: { title: '订单' }
  },
  {
    path: '/comment/list',
    name: 'comment/list',
    component: () => import('@/views/Comment/index.vue'),
    meta: { title: '评价' }
  },
  {
    path: '/image/list',
    name: 'image/list',
    component: () => import('@/views/Picture/index.vue'),
    meta: { title: '图库' }
  },
  {
    path: '/notice/list',
    name: 'notice/list',
    component: () => import('@/views/Notice/index.vue'),
    meta: { title: '公告' }
  },
  {
    path: '/setting/base',
    name: 'setting/base',
    component: () => import('@/views/Setup/index.vue'),
    meta: { title: '配置' }
  },
  {
    path: '/coupon/list',
    name: 'coupon/list',
    component: () => import('@/views/Coupon/index.vue'),
    meta: { title: '优惠卷' }
  },
  {
    path: '/manager/list',
    name: 'manager/list',
    component: () => import('@/views/Manager/index.vue'),
    meta: { title: '管理员' }
  },
  {
    path: '/access/list',
    name: 'access/list',
    component: () => import('@/views/access/index.vue'),
    meta: { title: '权限管理' }
  },
  {
    path: '/role/list',
    name: 'role/list',
    component: () => import('@/views/Role/index.vue'),
    meta: { title: '角色管理' }
  },
  {
    path: '/skus/list',
    name: 'skus/list',
    component: () => import('@/views/Skus/index.vue'),
    meta: { title: '商品管理' }
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
  }
  findAndAddRoute(menu)
  return hasNewRoute
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

//定义变量防止重复加载
let GetMenu = false
router.beforeEach(async (to) => {
  NProgress.start()
  const userStore = useUserStore()
  if (to.path !== '/login' && !userStore.token) {
    return '/login'
  }
  let hasNewRoute = false
  if (userStore.token && !GetMenu) {
    await userStore.getUserMenu()
    GetMenu = true
    hasNewRoute = addRoute(userStore.userMenu.menus)
  }
  let title = (to.meta.title || '') + ' - LEOLEOQiuuu'
  document.title = title
  //动态路由第一次注册要用push或者replace
  if (hasNewRoute) {
    return { path: to.fullPath }
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
