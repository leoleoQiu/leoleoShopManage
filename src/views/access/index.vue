<script setup>
import { getRuleListAPI } from '@/api/access.js'
import { ref } from 'vue'
const loading = ref(false)
const tableData = ref([])
const defaultExpandedKeys = ref([])
const getRuleList = async () => {
  loading.value = true
  try {
    const res = await getRuleListAPI()
    console.log(res)
    tableData.value = res.data.list
    defaultExpandedKeys.value = res.data.list.map((o) => o.id)
  } finally {
    loading.value = true
  }
}
getRuleList()
</script>
<template>
  <el-card>
    <div style="display: flex; justify-content: space-between">
      <PageHeader buttonTitle="新增权限"></PageHeader>
    </div>
    <el-tree
      :data="tableData"
      :props="{ label: 'name', children: 'child' }"
      nodeKey="id"
      @node-click="handleNodeClick"
      :defaultExpandedKeys="defaultExpandedKeys"
    >
      <template #default="{ data }">
        <div class="custom-tree-node">
          <div class="left">
            <el-tag
              :type="data.menu ? 'primary' : 'info'"
              style="margin-right: 10px"
              >{{ data.menu ? '菜单' : '权限' }}</el-tag
            >
            <el-icon v-if="data.icon" :size="20" style="margin-right: 5px">
              <component :is="data.icon"></component>
            </el-icon>
            <span>{{ data.name }}</span>
          </div>
          <div class="right">
            <el-switch
              :modelValue="data.status"
              :activeValue="1"
              :inactiveValue="0"
            ></el-switch>
            <el-button type="primary" text>修改</el-button>
            <el-button type="primary" text>增加</el-button>
            <el-button type="primary" text>删除</el-button>
          </div>
        </div>
      </template>
    </el-tree>
  </el-card>
</template>
<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  .left {
    display: flex;
    align-items: center;
  }
}
:deep(.el-tree-node__content) {
  padding: 15px 0;
}
</style>
