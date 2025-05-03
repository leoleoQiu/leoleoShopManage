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
    }
    const userMenu = ref([])
    const getUserMenu = async () => {
      const res = await getAdminMenuAPI(token.value)
      userMenu.value = res.data
    }
    return {
      token,
      getToken,
      removeToken,
      userMenu,
      getUserMenu
    }
  },
  {
    persist: true
  }
)
