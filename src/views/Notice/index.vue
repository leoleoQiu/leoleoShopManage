<script setup>
import { getNoticeListAPI } from '@/api/notice'
import { ref } from 'vue'
const NoticeList = ref([])
const totalCount = ref(0)
const loading = ref(false)
const currentPage = ref(1)
const getNoticeList = async (page = 1) => {
  loading.value = true
  try {
    const res = await getNoticeListAPI(page)
    console.log(res)
    NoticeList.value = res.data.list
    totalCount.value = res.data.totalCount
  } finally {
    loading.value = false
  }
}
getNoticeList()
//编辑
const handleEdit = (row) => {
  console.log(row)
}
//页面切换
const PageChange = (nowPage) => {
  currentPage.value = nowPage
  getNoticeList(currentPage.value)
}
</script>
<template>
  <el-container class="notice">
    <el-card shadow="hover" class="notice-card" v-loading="loading">
      <div class="top">
        <el-button type="primary">新增公告</el-button>
        <div
          class="icon"
          @click="getNoticeList(currentPage)"
          style="cursor: pointer"
        >
          <el-icon><Refresh /></el-icon>
        </div>
      </div>
      <el-table :data="NoticeList" stripe style="width: 100%">
        <el-table-column prop="content" label="公告标题" width="180" />
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
