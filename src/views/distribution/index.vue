<script setup>
import PanelPart from './components/PanelPart.vue'
import { getUserAPI } from '@/api/distribution.js'
import { ref } from 'vue'
const UserList = ref([])
const totalCount = ref(0)
const loading = ref(false)
const currentPage = ref(1)
const getUserList = async (page = 1, data) => {
  loading.value = true
  try {
    const res = await getUserAPI(page, data)
    console.log(res)
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
//搜索功能
const searchForm = ref({
  keyword: ''
})
const resetSearchWord = () => {
  searchForm.value.keyword = ''
}
const OnSearch = () => {
  getUserList(currentPage.value, searchForm.value)
}
</script>
<template>
  <div>
    <PanelPart></PanelPart>
    <el-row>
      <el-card shadow="hover" class="notice-card" v-loading="loading">
        <search-header @OnSearch="OnSearch" @resetSearchWord="resetSearchWord">
          <el-col :span="8">
            <el-form-item label="关键词">
              <el-input
                v-model="searchForm.keyword"
                placeholder="用户昵称"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </search-header>
        <el-table :data="UserList" stripe style="width: 100%">
          <el-table-column label="ID" prop="id" width="50"></el-table-column>
          <el-table-column label="管理员">
            <template #default="scope">
              <div class="demo-type">
                <div style="display: flex; align-items: center">
                  <el-avatar
                    :src="
                      scope.row.avatar ||
                      'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
                    "
                  />
                  <ul style="margin-left: 10px">
                    <li>昵称：{{ scope.row.username }}</li>
                    <li>姓名：{{ scope.row.user_info.name }}</li>
                    <li>电话：{{ scope.row.phone }}</li>
                  </ul>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="share_num" label="推广用户" align="center" />
          <el-table-column
            prop="share_order_num"
            label="订单数量"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="order_price" label="订单金额" align="center" />
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <div>
                <el-button text type="primary" @click="handleEdit(scope)">
                  推广人
                </el-button>
                <el-button text type="primary" @click="handleEdit(scope)">
                  推广订单
                </el-button>
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
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.notice-card {
  margin-top: 20px;
  width: 100%;
  :deep(.el-card__body) {
    padding-bottom: 0px;

    .el-table__row {
      height: 60px;
    }
  }
}
</style>
