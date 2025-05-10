<script setup>
import {
  getNoticeListAPI,
  addNoticeAPI,
  deleteNoticeAPI,
  editNoticeAPI
} from '@/api/notice'
import { ref } from 'vue'
const NoticeList = ref([])
const totalCount = ref(0)
const loading = ref(false)
const currentPage = ref(1)
const drawerTitle = ref('新增')
const getNoticeList = async (page = 1) => {
  loading.value = true
  try {
    const res = await getNoticeListAPI(page)
    NoticeList.value = res.data.list
    totalCount.value = res.data.totalCount
  } finally {
    loading.value = false
  }
}
getNoticeList()
//页面切换
const PageChange = (nowPage) => {
  currentPage.value = nowPage
  getNoticeList(currentPage.value)
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
    getNoticeList(currentPage.value)
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
    getNoticeList(currentPage.value)
  } finally {
    drawerRef.value.handleLoadingClose()
    drawerRef.value.close()
  }
}
</script>
<template>
  <el-container class="notice">
    <el-card shadow="hover" class="notice-card" v-loading="loading">
      <div class="top">
        <PageHeader
          buttonTitle="新增公告"
          @create="addNotice"
          @refresh="getNoticeList(currentPage)"
        ></PageHeader>
      </div>
      <el-table :data="NoticeList" stripe style="width: 100%">
        <el-table-column prop="content" label="公告内容" width="180" />
        <el-table-column prop="create_time" label="发布时间" />
        <el-table-column label="Operations">
          <template #default="scope">
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
