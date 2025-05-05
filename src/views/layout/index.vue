<script setup>
import FHeader from './components/FHeader.vue'
import FAside from './components/FAside.vue'
import FMain from './components/FMain.vue'
import { useUserStore } from '@/stores'
const userStore = useUserStore()
</script>
<template>
  <el-container>
    <el-header>
      <f-header></f-header>
    </el-header>
    <el-container>
      <el-aside
        :style="{
          width: userStore.MenuWidth,
          overflowX: 'hidden',
          transition: 'all 0.3s'
        }"
      >
        <f-aside></f-aside>
      </el-aside>
      <el-container>
        <el-header><f-main></f-main></el-header>
        <el-main>
          <router-view v-slot="{ Component }">
            <transition name="fade">
              <KeepAlive :max="5">
                <component :is="Component"></component>
              </KeepAlive>
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<style>
.el-header {
  padding: 0;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter-active {
  transition-delay: 0.3s;
}
</style>
