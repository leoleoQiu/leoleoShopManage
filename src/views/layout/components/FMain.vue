<script setup>
import { ref } from 'vue'
// let tabIndex = 2
const editableTabsValue = ref('2')
const editableTabs = ref([
  {
    title: 'Tab 1',
    name: '1',
    content: 'Tab 1 content'
  },
  {
    title: 'Tab 2',
    name: '2',
    content: 'Tab 2 content'
  }
])

// const addTab = (targetName) => {
//   const newTabName = `${++tabIndex}`
//   editableTabs.value.push({
//     title: 'New Tab',
//     name: newTabName,
//     content: 'New Tab content'
//   })
//   editableTabsValue.value = newTabName
// }
const removeTab = (targetName) => {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }

  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
}
</script>
<template>
  <div class="f-tags">
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      class="demo-tabs"
      closable
      @tab-remove="removeTab"
    >
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
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
            <el-dropdown-item disabled>Action 4</el-dropdown-item>
            <el-dropdown-item divided>Action 5</el-dropdown-item>
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
