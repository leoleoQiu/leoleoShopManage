<script setup>
import { ref } from 'vue'
const DialogVisible = ref(false)
const Open = () => {
  DialogVisible.value = true
}
//Picture中的函数
import AsidePage from '@/views/Picture/components/AsidePage.vue'
import ImagePage from '@/views/Picture/components/ImagePage.vue'
const Aside = ref(null)
const addPicture = () => {
  Aside.value.onAdd()
}
// 右侧图片列表获取
const ImageModuleRef = ref(null)
const gainPictureList = (id) => {
  ImageModuleRef.value.getImageData(id)
}
const UploadImg = () => {
  ImageModuleRef.value.UploadOpen()
}
//
const modelValue = defineModel()
let ImgUrl = ''
const avaterChoose = (url) => {
  ImgUrl = url
}
//处理头像选择
const handleConfirm = () => {
  if (ImgUrl) {
    modelValue.value = ImgUrl
    DialogVisible.value = false
  } else {
    ElMessage({
      message: '请选择图片',
      type: 'error'
    })
  }
}
</script>
<template>
  <div v-if="modelValue">
    <img
      :src="modelValue"
      alt=""
      class="avater-choose"
      style="object-fit: cover; margin-right: 5px"
    />
  </div>
  <div class="avater-choose" @click="Open">
    <el-icon size="25"><Plus /></el-icon>
  </div>
  <el-dialog
    v-model="DialogVisible"
    title="选择头像"
    center
    align-center
    width="75%"
  >
    <el-container class="image-body" :style="{ height: '70vh' }">
      <el-header class="image-header" style="border-bottom: 1px solid black">
        <el-button @click="addPicture" style="margin-left: 15px"
          >新增列表</el-button
        >
        <el-button @click="UploadImg">上传图片</el-button>
      </el-header>
      <el-container class="image-main">
        <AsidePage ref="Aside" @activeChange="gainPictureList"></AsidePage>
        <ImagePage
          ref="ImageModuleRef"
          @chooseImg="avaterChoose"
          isChoose
        ></ImagePage>
      </el-container>
    </el-container>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="DialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.avater-choose {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 15vh;
  aspect-ratio: 1/1;
  background-color: rgb(212, 212, 216);
  cursor: pointer;
  color: white;
}
</style>
