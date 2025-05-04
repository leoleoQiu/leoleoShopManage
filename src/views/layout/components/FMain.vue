<script setup>
import { layoutAPI } from '@/api/login'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
const router = useRouter()
const userStore = useUserStore()
const handleExit = () => {
  // 退出登录逻辑
  ElMessageBox.confirm('你确定要退出么?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await layoutAPI()
      await userStore.removeToken()
      router.push('/login')
    })
    .catch(() => {})
}
</script>
<template>
  <el-button @click="handleExit">退出</el-button>
</template>
