<script setup>
import AsidePage from './components/AsidePage.vue'
import ImagePage from './components/ImagePage.vue'
const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 60 - 55 - 50
</script>
<template>
  <el-container class="image-body" :style="{ height: h + 'px' }">
    <el-header class="image-header">Header</el-header>
    <el-container class="image-main">
      <AsidePage></AsidePage>
      <ImagePage></ImagePage>
    </el-container>
  </el-container>
</template>
<style lang="scss" scoped>
.image-body {
  background-color: rgb(236, 245, 255);
  .image-header {
    min-height: 100px;
    display: flex;
    align-items: center;
  }
  .image-main {
    .image-aside,
    .image-content {
      background-color: white;
      position: relative;
      .image-top {
        background-color: gray;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 50px;
        overflow-y: auto;
      }
      .image-bottom {
        position: absolute;
        background-color: gray;
        height: 50px;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }
  }
}
</style>
