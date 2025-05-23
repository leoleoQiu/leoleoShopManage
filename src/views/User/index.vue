<script setup>
import {
  getUserAPI,
  addUserAPI,
  deleteUserAPI,
  editUserAPI,
  changeUserStatusAPI
} from '@/api/user.js'
import { ref } from 'vue'
import ImageChoose from '@/views/Manager/components/ImageChoose.vue'
const UserList = ref([])
const totalCount = ref(0)
const loading = ref(false)
const currentPage = ref(1)
const drawerTitle = ref('新增')
const level = ref([])
const getUserList = async (page = 1, data) => {
  loading.value = true
  try {
    const res = await getUserAPI(page, data)
    console.log(res)
    level.value = res.data.user_level
    UserList.value = res.data.list.map((o) => {
      o.statusLoding = false
      return o
    })
    totalCount.value = res.data.totalCount
  } finally {
    loading.value = false
  }
}
getUserList()
//页面切换
const PageChange = (nowPage) => {
  currentPage.value = nowPage
  getUserList(currentPage.value)
}
//修改管理员状态
const OnSwitch = async (status, scope) => {
  try {
    scope.row.statusLoding = true
    await changeUserStatusAPI(scope.row.id, status)
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
  status: 1,
  nickname: '',
  phone: '',
  email: '',
  avatar: '',
  user_level_id: null
})
const addUser = async () => {
  drawerTitle.value = '新增'
  RowId.value = null
  formData.value = {
    username: '',
    password: '',
    status: 1,
    nickname: '',
    phone: '',
    email: '',
    avatar: '',
    user_level_id: null
  }
  drawerRef.value.open()
}
//编辑
const RowId = ref(null)
const handleEdit = async (row) => {
  drawerTitle.value = '编辑'
  RowId.value = row.row.id
  for (let key in formData.value) {
    if (key === 'role_id') {
      formData.value[key] = row.row.role.id
    } else {
      formData.value[key] = row.row[key]
    }
  }
  drawerRef.value.open()
}
//删除
const deleteUser = async (row) => {
  try {
    loading.value = true
    await deleteUserAPI(row.row.id)
    getUserList(currentPage.value)
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
      await addUserAPI(newForm)
    } else {
      await editUserAPI(RowId.value, formData.value)
    }
    getUserList(currentPage.value)
  } finally {
    drawerRef.value.handleLoadingClose()
    drawerRef.value.close()
  }
}
//搜索功能
const searchForm = ref({
  keyword: '',
  user_level_id: null
})
const resetSearchWord = () => {
  searchForm.value.keyword = ''
  searchForm.value.user_level_id = null
}
const OnSearch = () => {
  getUserList(currentPage.value, searchForm.value)
}
</script>
<template>
  <el-container class="notice">
    <el-card shadow="hover" class="notice-card" v-loading="loading">
      <search-header @OnSearch="OnSearch" @resetSearchWord="resetSearchWord">
        <el-col :span="8">
          <el-form-item label="关键词">
            <el-input
              v-model="searchForm.keyword"
              placeholder="手机号/会员昵称"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <template #show>
          <el-col :span="8">
            <el-form-item label="会员等级">
              <el-select
                v-model="searchForm.user_level_id"
                placeholder="请选择会员等级"
              >
                <el-option
                  v-for="item in level"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </template>
      </search-header>
      <div class="top">
        <PageHeader
          buttonTitle="新增"
          @create="addUser"
          @refresh="getUserList(currentPage)"
        ></PageHeader>
      </div>
      <el-table :data="UserList" stripe style="width: 100%">
        <el-table-column label="管理员" width="250">
          <template #default="scope">
            <div class="demo-type">
              <div style="display: flex">
                <el-avatar
                  :src="
                    scope.row.avatar ||
                    'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
                  "
                />
                <div style="margin-left: 10px">
                  <p>{{ scope.row.username }}</p>
                  <span>ID：{{ scope.row.id }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="user_level.name"
          label="会员等级"
          align="center"
        />
        <el-table-column prop="user_level.name" label="会员等级" align="center">
          <template #default="scope">
            <div>注册时间：{{ scope.row.create_time }}</div>
          </template>
        </el-table-column>
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
                @confirm="deleteUser(scope)"
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
        <el-form-item label="昵称">
          <el-input v-model="formData.nickname"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <ImageChoose v-model="formData.avatar"></ImageChoose>
        </el-form-item>
        <el-form-item label="会员等级">
          <el-select
            v-model="formData.user_level_id"
            placeholder="请选择会员等级"
          >
            <el-option
              v-for="item in level"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="formData.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email"></el-input>
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
