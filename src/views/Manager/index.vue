<script setup>
import {
  getManagerAPI,
  changeMangerStatusAPI,
  addManagerAPI,
  deleteManagerAPI,
  editManagerAPI
} from '@/api/manager.js'
import { ref } from 'vue'
const ManagerList = ref([])
const totalCount = ref(0)
const loading = ref(false)
const currentPage = ref(1)
const drawerTitle = ref('新增')
const rolesList = ref([])
const getManagerList = async (page = 1, limit = 10, keyword = null) => {
  loading.value = true
  try {
    const res = await getManagerAPI(page, limit, keyword)
    console.log(res)
    rolesList.value = res.data.roles
    ManagerList.value = res.data.list.map((o) => {
      o.statusLoding = false
      return o
    })
    totalCount.value = res.data.totalCount
  } finally {
    loading.value = false
  }
}
getManagerList()
//页面切换
const PageChange = (nowPage) => {
  currentPage.value = nowPage
  getManagerList(currentPage.value)
}
//修改管理员状态
const OnSwitch = async (status, scope) => {
  // const item = ManagerList.value.find((item) => item.id === scope.row.id)
  try {
    scope.row.statusLoding = true
    await changeMangerStatusAPI(scope.row.id, status)
    scope.row.status = status
  } finally {
    scope.row.statusLoding = false
  }
}
//新增
const drawerRef = ref(null)
const formRef = ref(null)
const formData = ref({
  username: '',
  password: '',
  role_id: '',
  status: 1,
  avater: ''
})
const rules = {
  username: [
    {
      required: true,
      message: '请输入信息',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入信息',
      trigger: 'blur'
    }
  ]
}
const addManager = async () => {
  drawerTitle.value = '新增'
  RowId.value = null
  formData.value = {
    username: '',
    password: '',
    role_id: '',
    status: 1,
    avater: ''
  }
  drawerRef.value.open()
}
//编辑
const RowId = ref(null)
const handleEdit = async (row) => {
  drawerTitle.value = '编辑'
  RowId.value = row.row.id
  formData.value.title = row.row.title
  formData.value.content = row.row.content
  drawerRef.value.open()
}
//删除
const deleteManager = async (row) => {
  try {
    loading.value = true
    await deleteManagerAPI(row.row.id)
    getManagerList(currentPage.value)
  } finally {
    loading.value = false
  }
}
//提交表单
const submitForm = async () => {
  await formRef.value.validate()
  try {
    drawerRef.value.handleLoading()
    if (!RowId.value) {
      //遍历对象提取非空value的属性
      const newForm = {}
      for (let key in formData.value) {
        if (formData.value[key]) {
          newForm[key] = formData.value[key]
        }
      }
      await addManagerAPI(newForm)
    } else {
      await editManagerAPI(RowId.value, formData.value)
    }
    getManagerList(currentPage.value)
  } finally {
    drawerRef.value.handleLoadingClose()
    drawerRef.value.close()
  }
}
//搜索功能
const searchForm = ref({
  keyword: ''
})
const resetSearchWord = () => {
  searchForm.value.keyword = ''
}
const OnSearch = () => {
  getManagerList(currentPage.value, 10, searchForm.value.keyword)
}
</script>
<template>
  <el-container class="notice">
    <el-card shadow="hover" class="notice-card" v-loading="loading">
      <el-form :model="searchForm">
        <el-row>
          <el-col :span="10">
            <el-form-item label="搜索">
              <el-input
                v-model="searchForm.keyword"
                placeholder="管理员名称"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="6">
            <div style="display: flex; justify-content: flex-end">
              <el-button type="primary" @click="OnSearch">搜索</el-button>
              <el-button @click="resetSearchWord">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div class="top">
        <el-button type="primary" @click="addManager">新增管理员</el-button>
        <div
          class="icon"
          @click="getManagerList(currentPage)"
          style="cursor: pointer"
        >
          <el-icon><Refresh /></el-icon>
        </div>
      </div>
      <el-table :data="ManagerList" stripe style="width: 100%">
        <el-table-column label="管理员" width="250">
          <template #default="scope">
            <div class="demo-type">
              <div style="display: flex">
                <el-avatar :icon="UserFilled" />
                <div style="margin-left: 10px">
                  <p>{{ scope.row.username }}</p>
                  <span>ID：{{ scope.row.role.id }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="role.name" label="所属管理员" align="center" />
        <el-table-column label="状态" width="200" align="center">
          <template #default="scope">
            <el-switch
              @change="OnSwitch($event, scope)"
              :modelValue="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              :loading="scope.row.statusLoding"
              :disabled="scope.row.super === 1"
            />
          </template>
        </el-table-column>
        <el-table-column label="Operations" align="center">
          <template #default="scope">
            <span v-if="scope.row.super === 1">暂无操作</span>
            <div v-else>
              <el-button text type="primary" @click="handleEdit(scope)">
                修改
              </el-button>
              <el-popconfirm
                width="220"
                icon-color="#626AEF"
                title="你确认要删除吗?"
                @confirm="deleteManager(scope)"
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
            </div>
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
    <!-- 抽屉组件 -->
    <FormDrawer ref="drawerRef" @submit="submitForm" :title="drawerTitle">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="auto"
      >
        <el-form-item prop="username" label="用户名">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="formData.password"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="formData.avater"></el-input>
        </el-form-item>
        <el-form-item label="所属角色">
          <el-select v-model="formData.role_id" placeholder="请输入用户角色">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="formData.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-container>
</template>
<style lang="scss" scoped>
.notice {
  .notice-card {
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
