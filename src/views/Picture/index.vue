<script setup>
import { ref } from 'vue'
import AsidePage from './components/AsidePage.vue'
import ImagePage from './components/ImagePage.vue'
const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 60 - 55 - 50
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
</script>
<template>
  <el-container class="image-body" :style="{ height: h + 'px' }">
    <el-header class="image-header" style="border-bottom: 1px solid black">
      <el-button @click="addPicture" style="margin-left: 15px"
        >新增列表</el-button
      >
      <el-button @click="UploadImg">上传图片</el-button>
    </el-header>
    <el-container class="image-main">
      <AsidePage ref="Aside" @activeChange="gainPictureList"></AsidePage>
      <ImagePage ref="ImageModuleRef"></ImagePage>
    </el-container>
  </el-container>
</template>
<style lang="scss" scoped>
.image-body {
  background-color: rgb(244, 244, 245);
  border: 2px solid black;
  border-radius: 5px;
  .image-header {
    min-height: 100px;
    display: flex;
    align-items: center;
  }
}
</style>
