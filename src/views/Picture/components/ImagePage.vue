<script setup>
import { ref, computed } from 'vue'
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
const image_class_id = ref(0)
//获取数据渲染
const getImageData = async (id) => {
  Loading.value = true
  try {
    currentId.value = id
    const res = await getClassPictureAPI(id, currentPage.value)
    console.log(res)
    ImageList.value = res.data.list.map((o) => {
      o.checked = false
      return o
    })
    image_class_id.value = res.data?.list?.[0]?.image_class_id
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
//上传图片
import UploadFile from './UploadFile.vue'
const drawer = ref(false)
const UploadOpen = () => {
  drawer.value = true
}
const UploadSuccess = () => {
  getImageData(currentId.value)
  drawer.value = false
}

const props = defineProps({
  isChoose: {
    type: Boolean,
    default: false
  },
  limit: {
    type: Number,
    default: 1
  }
})
//多选框change
const ImageChooseNum = computed(() =>
  ImageList.value.filter((o) => o.checked === true)
)
const emit = defineEmits(['chooseImg'])
const CheckedChange = (item) => {
  if (props.limit === 1) {
    if (ImageChooseNum.value.length > 1) {
      item.checked = false
      ImageList.value.find((o) => o.checked === true).checked = false
      item.checked = true
    }
    if (ImageChooseNum.value.length === 0) {
      emit('chooseImg')
    } else {
      emit('chooseImg', item.url)
    }
  } else {
    emit('chooseImg', ImageChooseNum.value)
  }
}
defineExpose({ getImageData, UploadOpen })
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
                <el-checkbox
                  v-if="isChoose"
                  v-model="item.checked"
                  @change="CheckedChange(item)"
                ></el-checkbox>
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
      />
    </div>
  </el-main>
  <el-drawer v-model="drawer" title="上传文件">
    <UploadFile
      :data="{ image_class_id }"
      @success="UploadSuccess"
    ></UploadFile>
  </el-drawer>
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
