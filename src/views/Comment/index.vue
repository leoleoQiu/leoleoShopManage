<script setup>
import {
  getCommentAPI,
  updateStatusCommentAPI,
  reviewCommentAPI
} from '@/api/comment.js'
import { ref } from 'vue'
const CommentList = ref([])
const totalCount = ref(0)
const loading = ref(false)
const currentPage = ref(1)
const getCommentList = async (page = 1, data) => {
  loading.value = true
  try {
    const res = await getCommentAPI(page, data)
    console.log(res)
    CommentList.value = res.data.list.map((o) => {
      o.statusLoding = false
      o.textareaText = ''
      o.textareaEdit = false
      return o
    })
    totalCount.value = res.data.totalCount
  } finally {
    loading.value = false
  }
}
getCommentList()
//页面切换
const PageChange = (nowPage) => {
  currentPage.value = nowPage
  getCommentList(currentPage.value)
}
//修改管理员状态
const OnSwitch = async (status, scope) => {
  try {
    scope.row.statusLoding = true
    await updateStatusCommentAPI(scope.row.id, status)
    scope.row.status = status
  } finally {
    scope.row.statusLoding = false
  }
}
//搜索功能
const searchForm = ref({
  title: ''
})
const resetSearchWord = () => {
  searchForm.value.title = ''
}
const OnSearch = () => {
  getCommentList(currentPage.value, 10, searchForm.value.title)
}
//评论功能
const commentSubmit = async (data) => {
  loading.value = true
  try {
    await reviewCommentAPI(data.id, { data: data.textareaText })
    await getCommentList()
    ElMessage.success('成功回复')
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <el-container class="notice">
    <el-card shadow="hover" class="notice-card" v-loading="loading">
      <search-header @OnSearch="OnSearch" @resetSearchWord="resetSearchWord">
        <el-col :span="8">
          <el-form-item label="搜索">
            <el-input
              v-model="searchForm.title"
              placeholder="商品名称"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
      </search-header>
      <el-table :data="CommentList" stripe style="width: 100%" row-key="id">
        <el-table-column type="expand">
          <template #default="props">
            <div style="display: flex; padding: 20px; padding-left: 50px">
              <el-avatar
                :src="props.row.user.avatar"
                style="vertical-align: middle"
              ></el-avatar>
              <div class="right" style="margin-left: 10px; width: 100%">
                <div
                  class="top"
                  style="display: flex; justify-content: space-between"
                >
                  <div>
                    <div style="display: flex">
                      <span>{{ props.row.user.nickname }}</span>
                      <span style="margin-left: 5px">
                        {{ props.row.user.create_time }}
                      </span>
                    </div>
                    <p>{{ props.row.review.data }}</p>
                  </div>
                  <el-button
                    v-if="!props.row.textareaEdit"
                    size="small"
                    type="primary"
                    style="margin-right: 10px"
                    @click="props.row.textareaEdit = true"
                    >回复</el-button
                  >
                </div>
                <div class="productImage" style="margin-top: 10px">
                  <el-image
                    style="width: 80px; height: 80px"
                    :src="props.row.review.image[0]"
                  ></el-image>
                </div>
                <div
                  v-if="!props.row.textareaEdit"
                  style="
                    display: flex;
                    justify-content: space-between;
                    background-color: rgb(245, 246, 249);
                    min-height: 70px;
                    padding: 10px;
                  "
                >
                  <div>
                    <p style="font-weight: 700">客服</p>
                    <span style="margin-top: 15px; display: block">{{
                      props.row.extra[0].data
                    }}</span>
                  </div>
                  <el-button
                    type="warning"
                    size="small"
                    @click.stop="props.row.textareaEdit = true"
                    >修改</el-button
                  >
                </div>
                <div
                  v-else
                  style="
                    background-color: rgb(245, 246, 249);
                    min-height: 70px;
                    padding: 10px;
                  "
                >
                  <el-input
                    type="textarea"
                    :rows="2"
                    v-model="props.row.textareaText"
                  ></el-input>
                  <el-button
                    size="small"
                    type="primary"
                    @click="commentSubmit(props.row)"
                    >回复</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    @click="props.row.textareaEdit = false"
                    >取消</el-button
                  >
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column label="商品" width="250">
          <template #default="scope">
            <div class="demo-type">
              <div style="display: flex">
                <img
                  :src="scope.row.goods_item.cover"
                  style="width: 64px; aspect-ratio: 1/1; object-fit: cover"
                />
                <div style="margin-left: 10px">
                  <p>{{ scope.row.goods_item.title }}</p>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="评价信息" align="center">
          <template #default="scope">
            <div>
              <div>用户：昵称</div>
              <el-rate
                v-model="scope.row.rating"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="review_time" label="评价时间" align="center" />
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
