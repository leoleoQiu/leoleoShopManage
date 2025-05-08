<script setup>
import { ref } from 'vue'
import {
  getClassPictureAPI,
  EditClassPictureAPI,
  DeleteClassPictureAPI
} from '@/api/picture'
const currentPage = ref(1)
const total = ref(0)
const ImageList = ref([])
const currentId = ref(0)
const Loading = ref(false)
//获取数据渲染
const getImageData = async (id) => {
  Loading.value = true
  try {
    currentId.value = id
    const res = await getClassPictureAPI(id, currentPage.value)
    console.log(res)
    ImageList.value = res.data.list
  } finally {
    Loading.value = false
  }
}
//修改名称
const NameChange = async (ImgId, ImgName) => {
  const rename = await ElMessageBox.prompt('重命名', 'Tip', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern: /.+/,
    inputErrorMessage: '不能为空',
    inputValue: ImgName
  })
  await EditClassPictureAPI(ImgId, rename.value)
  getImageData(currentId.value)
  ElMessage({
    type: 'success',
    message: '修改成功'
  })
}
//删除图片
const DeleteImg = async (ImgId) => {
  await DeleteClassPictureAPI([ImgId])
  getImageData(currentId.value)
}
defineExpose({ getImageData })
</script>
<template>
  <el-main class="image-content" v-loading="Loading">
    <div class="image-top">
      <el-row :gutter="20" class="row-item">
        <el-col
          :span="6"
          v-for="item in ImageList"
          :key="item.id"
          class="col-item"
        >
          <el-card class="card-item" style="padding: 0">
            <img :src="item.url" alt="create_time" class="image-item" />
            <template #footer>
              <div
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
                class="button-item"
              >
                <el-button
                  type="primary"
                  text
                  @click="NameChange(item.id, item.name)"
                  >重命名</el-button
                >
                <el-button type="primary" text @click="DeleteImg(item.id)"
                  >删除</el-button
                >
              </div>
            </template>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="image-bottom">
      <el-pagination
        background
        layout="prev, next"
        v-model:current-page="currentPage"
        :total="total"
        @update:current-page="getPicture"
      />
    </div>
  </el-main>
</template>
<style lang="scss" scoped>
.image-content {
  position: relative;
  .image-top {
    background-color: rgb(244, 244, 245);
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 50px;
    overflow-y: auto;
    .card-item {
      cursor: pointer;
      margin-left: 5px;
      margin-top: 5px;
      height: 300px;
      :deep(.el-card__body) {
        padding: 0;
        height: 80%;
        width: 100%;
        .image-item {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
      }
      :deep(.el-card__footer) {
        height: 20%;
        .button-item span {
          font-size: 18px;
        }
      }
    }
    .col-item:nth-child(-n + 4) .card-item {
      margin-top: 0;
    }
  }
  .image-bottom {
    position: absolute;
    background-color: rgb(226, 232, 240);
    height: 50px;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
  }
}
</style>
