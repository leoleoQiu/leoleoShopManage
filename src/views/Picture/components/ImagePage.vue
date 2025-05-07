<script setup></script>
<template>
  <el-main class="image-content">
    <div class="image-top">12</div>
    <div class="image-bottom">分页</div>
  </el-main>
</template>
<style lang="scss" scoped>
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
</style>
