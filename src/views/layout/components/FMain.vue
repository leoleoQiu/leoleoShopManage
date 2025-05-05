<script setup>
import { ref } from 'vue'
import { useRoute, onBeforeRouteUpdate, useRouter } from 'vue-router'
import { usePageStore } from '@/stores'
const pageStore = usePageStore()
const route = useRoute()
const router = useRouter()
const activeTag = ref(route.path)
const TabList = ref(pageStore.TagList)

onBeforeRouteUpdate((to) => {
  activeTag.value = to.fullPath
  addTab({
    title: to.meta.title,
    path: to.fullPath
  })
})
//如果没有的话就增加 可以借助onBeforeRouteUpdate
const addTab = (tab) => {
  const haveTab = TabList.value.find((e) => e.path === tab.path)
  if (!haveTab) {
    TabList.value.push(tab)
    pageStore.updateTagList(TabList.value)
  }
}

const changeTab = (e) => {
  router.push(e)
}
const removeTab = (targetName) => {
  console.log(targetName)
}
</script>
<template>
  <div class="f-tags">
    <el-tabs
      v-model="activeTag"
      type="card"
      class="demo-tabs"
      @tab-remove="removeTab"
      @tab-change="changeTab"
    >
      <el-tab-pane
        :closable="item.path !== '/'"
        v-for="item in TabList"
        :key="item.path"
        :label="item.title"
        :name="item.path"
      >
      </el-tab-pane>
    </el-tabs>
    <span class="right">
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.f-tags {
  display: flex;
  justify-content: space-between;
  .el-tabs__content {
    min-width: 20px;
  }
  .right {
    margin-right: 50px;
    margin-top: 10px;
    .el-dropdown {
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border: 1px solid grey;
      border-radius: 4px;
      span {
        width: 100%;
        i {
          font-size: 20px;
          margin: 0;
        }
      }
    }
  }
}
</style>
