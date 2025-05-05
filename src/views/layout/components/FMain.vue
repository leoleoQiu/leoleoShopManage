<script setup>
import { Tabfunction } from '@/composables/Tabs'
const { TabList, activeTag, changeTab, removeTab, handleClose } = Tabfunction()
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
      <el-dropdown @command="handleClose">
        <span class="el-dropdown-link">
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="all">关闭全部</el-dropdown-item>
            <el-dropdown-item command="else">关闭其他</el-dropdown-item>
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
