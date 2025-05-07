<script setup>
import { ref } from 'vue'
import AsideList from './AsideList.vue'
import { getPictureAPI } from '@/api/picture'
const pictureList = ref([])
//设置当前选中的
const activeItem = ref(0)
const loading = ref(false)
const getPicture = async () => {
  loading.value = true
  try {
    const res = await getPictureAPI(1)
    pictureList.value = res.data.list
    activeItem.value = res.data.list[0].id
  } finally {
    loading.value = false
  }
}
getPicture()
</script>
<template>
  <el-aside width="250px" class="image-aside" v-loading="loading">
    <div class="image-top">
      <AsideList
        v-for="item in pictureList"
        :title="item.name"
        :key="item.id"
        :active="activeItem === item.id"
      ></AsideList>
      <AsideList title="模拟很长很长很长很长的文案"></AsideList>
      <AsideList title="模拟很长很长很长很长的文案"></AsideList>
      <AsideList title="模拟很长很长很长很长的文案"></AsideList>
      <AsideList title="模拟很长很长很长很长的文案"></AsideList>
    </div>
    <div class="image-bottom">分页</div>
  </el-aside>
</template>
<style lang="scss" scoped>
.image-aside,
.image-content {
  position: relative;
  .image-top {
    background-color: rgba(0, 0, 0, 0.1);
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 50px;
    overflow-y: auto;
    &:nth-child(1) {
      border-top: 1px solid black;
    }
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
