import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI } from '@/api/login'
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const getToken = async ({ username, password }) => {
      const res = await loginAPI({ username, password })
      token.value = res.data.token
    }
    const removeToken = () => {
      token.value = ''
    }
    return {
      token,
      getToken,
      removeToken
    }
  },
  {
    persist: true
  }
)
