<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()
const asideList = computed(() => {
  return userStore.userMenu.menus
})

const isCollapse = computed(() => {
  return !(userStore.MenuWidth === '250px')
})

const handleSelect = (e) => {
  router.push(e)
}
</script>
<template>
  <div class="f-aside" :style="{ width: userStore.MenuWidth }">
    <el-menu
      :unique-opened="true"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      :collapse-transition="false"
      @select="handleSelect"
      :default-active="$route.path"
    >
      <template v-for="(item, index) in asideList" :key="index">
        <el-sub-menu
          :index="item.order"
          v-if="item.child && item.child.length > 0"
        >
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item
            v-for="item2 in item.child"
            :key="item2.name"
            :index="item2.frontpath"
          >
            <el-icon>
              <component :is="item2.icon"></component>
            </el-icon>
            <span>{{ item2.name }}</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="item.frontpath">
          <el-icon>
            <component :is="item2.icon"></component>
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<style lang="scss" scoped>
.f-aside {
  transition: all 0.3s;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 0px;
  }
  .el-menu {
    border: 0px;
    span {
      font-size: 16px;
    }
  }
}
</style>
