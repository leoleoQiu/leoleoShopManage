import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI, getAdminMenuAPI } from '@/api/login'
export const useUserStore = defineStore(
  'user-leoleo',
  () => {
    const token = ref('')
    const getToken = async ({ username, password }) => {
      const res = await loginAPI({ username, password })
      token.value = res.data.token
    }
    const removeToken = () => {
      token.value = ''
      userMenu.value = []
    }
    const userMenu = ref([])
    const getUserMenu = async () => {
      const res = await getAdminMenuAPI(token.value)
      userMenu.value = res.data
    }
    const MenuWidth = ref('250px')
    const toggleMenu = () => {
      MenuWidth.value = MenuWidth.value === '250px' ? '64px' : '250px'
    }
    return {
      token,
      getToken,
      removeToken,
      userMenu,
      getUserMenu,
      MenuWidth,
      toggleMenu
    }
  },
  {
    persist: true
  }
)
