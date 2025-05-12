<script setup>
import {
  getRoleListAPI,
  addRoleAPI,
  deleteRoleAPI,
  editRoleAPI,
  changeRoleStatusAPI,
  SetRoleRuleAPI
} from '@/api/role.js'
import { ref, nextTick } from 'vue'
const RoleList = ref([])
const totalCount = ref(0)
const loading = ref(false)
const currentPage = ref(1)
const drawerTitle = ref('新增')
const getRoleList = async (page = 1) => {
  loading.value = true
  try {
    const res = await getRoleListAPI(page)
    // console.log(res)
    RoleList.value = res.data.list
    totalCount.value = res.data.totalCount
  } finally {
    loading.value = false
  }
}
getRoleList()
//页面切换
const PageChange = (nowPage) => {
  currentPage.value = nowPage
  getRoleList(currentPage.value)
}

//新增
const drawerRef = ref(null)
const formRef = ref(null)
const formData = ref({
  name: '',
  status: 1,
  desc: ''
})
const rules = {
  name: [
    {
      required: true,
      message: '请输入信息',
      trigger: 'blur'
    }
  ],
  desc: [
    {
      required: true,
      message: '请输入信息',
      trigger: 'blur'
    }
  ]
}
const addRole = async () => {
  drawerTitle.value = '新增'
  RowId.value = null
  formData.value = { name: '', status: 1, desc: '' }
  drawerRef.value.open()
}
//编辑
const RowId = ref(null)
const handleEdit = async (row) => {
  drawerTitle.value = '编辑'
  RowId.value = row.row.id
  for (let k in formData.value) {
    formData.value[k] = row.row[k]
  }
  drawerRef.value.open()
}
//删除
const deleteRole = async (row) => {
  try {
    loading.value = true
    await deleteRoleAPI(row.row.id)
    getRoleList(currentPage.value)
  } finally {
    loading.value = false
  }
}
//修改状态
const loadingStatus = ref(false)
const StatusChange = async (status, data) => {
  loadingStatus.value = true
  try {
    await changeRoleStatusAPI(data.id, status)
    data.status = status === 0 ? 0 : 1
  } finally {
    loadingStatus.value = false
  }
}
//提交表单
const submitForm = async () => {
  await formRef.value.validate()
  try {
    drawerRef.value.handleLoading()
    if (!RowId.value) {
      await addRoleAPI(formData.value)
    } else {
      await editRoleAPI(RowId.value, formData.value)
    }
    getRoleList(currentPage.value)
  } finally {
    drawerRef.value.handleLoadingClose()
    drawerRef.value.close()
  }
}

//权限设置
import { getRuleListAPI } from '@/api/access.js'
const drawerRuleRef = ref(null)
const RuleList = ref([])
const treeHeight = window.innerHeight - 180
const defaultExpandedKeys = ref([])
const ruleIds = ref([])
const treeRef = ref(null)
const checkStrictly = ref(false)
//打开权限抽屉
const handleSetRule = async (scope) => {
  //设置父子节点不关联
  checkStrictly.value = true
  //记录当前选中的ID
  RowId.value = scope.row.id
  //方法一：否则第二次RuleList有数据，el-tree会直接渲染
  // RuleList.value = []
  const res = await getRuleListAPI()
  RuleList.value = res.data.list
  //设置展开的KEY数组
  defaultExpandedKeys.value = RuleList.value.map((o) => o.id)
  drawerRuleRef.value.open()
  ruleIds.value = scope.row.rules.map((o) => o.id)
  //等待dom渲染完成
  await nextTick()
  treeRef.value.setCheckedKeys(ruleIds.value)
  //方法二：设置settimeout，setCheckedKeys这个方法组件内部做了处理，是异步，再原先有数据的话，会立刻执行checkStrictly.value = false
  setTimeout(() => {
    checkStrictly.value = false
  }, 100)
}
//复选框改变
const treeCheck = (...object) => {
  const { checkedKeys, halfCheckedKeys } = object[1]
  ruleIds.value = [...checkedKeys, ...halfCheckedKeys]
}
//提交表单
const submitRuleForm = async () => {
  drawerRuleRef.value.handleLoading()
  try {
    await SetRoleRuleAPI(RowId.value, ruleIds.value)
    ElMessage.success('成功修改')
    getRoleList(currentPage.value)
  } finally {
    drawerRuleRef.value.close()
    drawerRuleRef.value.handleLoadingClose()
  }
}
</script>
<template>
  <el-container class="Role">
    <el-card shadow="hover" class="Role-card" v-loading="loading">
      <div class="top">
        <PageHeader
          buttonTitle="新增角色"
          @create="addRole"
          @refresh="getRoleList(currentPage)"
        ></PageHeader>
      </div>
      <el-table :data="RoleList" stripe style="width: 100%">
        <el-table-column prop="name" label="角色名称" width="180" />
        <el-table-column prop="desc" label="角色描述" align="center" />
        <el-table-column label="状态" width="250">
          <template #default="scope">
            <el-switch
              :modelValue="scope.row.status"
              :activeValue="1"
              :inactiveValue="0"
              @change="(e) => StatusChange(e, scope.row)"
              :loading="loadingStatus"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button text type="primary" @click="handleSetRule(scope)">
              配置权限
            </el-button>
            <el-button text type="primary" @click="handleEdit(scope)">
              修改
            </el-button>
            <el-popconfirm
              width="220"
              icon-color="#626AEF"
              title="你确认要删除吗?"
              @confirm="deleteRole(scope)"
            >
              <template #reference>
                <el-button type="primary" text> 删除 </el-button>
              </template>
              <template #actions="{ confirm, cancel }">
                <el-button size="small" @click="cancel">No!</el-button>
                <el-button type="danger" size="small" @click="confirm">
                  Yes?
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <template #footer
        ><el-pagination
          style="display: flex; justify-content: center"
          background
          :page-size="10"
          layout="prev, pager, next"
          :total="totalCount"
          @update:current-page="PageChange"
      /></template>
    </el-card>
    <FormDrawer ref="drawerRef" @submit="submitForm" :title="drawerTitle">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="auto"
      >
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item prop="desc" label="角色描述">
          <el-input
            type="textarea"
            v-model="formData.desc"
            :rows="5"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="formData.status"
            :activeValue="1"
            :inactiveValue="0"
          ></el-switch>
        </el-form-item>
      </el-form>
    </FormDrawer>
    <!-- 配置权限 -->
    <FormDrawer
      ref="drawerRuleRef"
      @submit="submitRuleForm"
      title="配置权限"
      size="30%"
    >
      <el-tree-v2
        node-key="id"
        ref="treeRef"
        style="max-width: 600px"
        :data="RuleList"
        :props="{ label: 'name', children: 'child' }"
        show-checkbox
        :height="treeHeight"
        :default-expanded-keys="defaultExpandedKeys"
        @check="treeCheck"
        :check-strictly="checkStrictly"
      >
        <template #default="{ data }">
          <el-tag
            :type="data.menu ? 'primary' : 'info'"
            style="margin-right: 4px"
          >
            {{ data.menu ? '菜单' : '权限' }}
          </el-tag>
          <div>
            {{ data.name }}
          </div>
        </template>
      </el-tree-v2>
    </FormDrawer>
  </el-container>
</template>
<style lang="scss" scoped>
.Role {
  .Role-card {
    width: 100%;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    :deep(.el-card__body) {
      padding-bottom: 0px;

      .el-table__row {
        height: 60px;
      }
    }
  }
}
</style>
