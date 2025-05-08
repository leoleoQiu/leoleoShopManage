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
</script>
<template>
  <el-container class="image-body" :style="{ height: h + 'px' }">
    <el-header class="image-header">
      <el-button @click="addPicture">新增图片</el-button>
    </el-header>
    <el-container class="image-main">
      <AsidePage ref="Aside"></AsidePage>
      <ImagePage></ImagePage>
    </el-container>
  </el-container>
</template>
<style lang="scss" scoped>
.image-body {
  background-color: rgb(244, 244, 245);
  .image-header {
    min-height: 100px;
    display: flex;
    align-items: center;
  }
}
</style>
