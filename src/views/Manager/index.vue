<script setup>
import { addNoticeAPI, deleteNoticeAPI, editNoticeAPI } from '@/api/notice'
import { getManagerAPI, changeMangerStatusAPI } from '@/api/manager.js'
import { ref } from 'vue'
const ManagerList = ref([])
const totalCount = ref(0)
const loading = ref(false)
const currentPage = ref(1)
const drawerTitle = ref('新增')
const getManagerList = async (page = 1, limit = 10, keyword = null) => {
  loading.value = true
  try {
    const res = await getManagerAPI(page, limit, keyword)
    console.log(res)
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
  scope.row.statusLoding = true
  await changeMangerStatusAPI(scope.row.id, status)
  scope.row.statusLoding = false
  scope.row.status = status
}
//新增
const drawerRef = ref(null)
const formRef = ref(null)
const formData = ref({
  title: '',
  content: ''
})
const rules = {
  title: [
    {
      required: true,
      message: '请输入信息',
      trigger: 'blur'
    }
  ],
  content: [
    {
      required: true,
      message: '请输入信息',
      trigger: 'blur'
    }
  ]
}
const addNotice = async () => {
  drawerTitle.value = '新增'
  RowId.value = null
  formData.value = { title: '', content: '' }
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
const deleteNotice = async (row) => {
  try {
    loading.value = true
    await deleteNoticeAPI(row.row.id)
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
      await addNoticeAPI(formData.value)
    } else {
      await editNoticeAPI(
        RowId.value,
        formData.value.title,
        formData.value.content
      )
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
        <el-button type="primary" @click="addNotice">新增管理员</el-button>
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
                @confirm="deleteNotice(scope)"
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
    <FormDrawer ref="drawerRef" @submit="submitForm" :title="drawerTitle">
      <el-form ref="formRef" :model="formData" :rules="rules">
        <el-form-item prop="title" label="公告标题">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item prop="content" label="公告内容">
          <el-input
            type="textarea"
            v-model="formData.content"
            :rows="5"
          ></el-input>
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
