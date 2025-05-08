<script setup>
import { ref } from 'vue'
import AsideList from './AsideList.vue'
import { getPictureAPI } from '@/api/picture'
const pictureList = ref([])
//设置当前选中的
const activeItem = ref(0)
const loading = ref(false)
//分页
const currentPage = ref(1)
const total = ref(0)
const getPicture = async (page = 1) => {
  loading.value = true
  currentPage.value = page
  try {
    const res = await getPictureAPI(currentPage.value)
    pictureList.value = res.data.list
    total.value = res.data.totalCount
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
  </el-aside>
</template>
<style lang="scss" scoped>
.image-aside {
  position: relative;
  border: 1px solid black;
  .image-top {
    background-color: rgb(244, 244, 245);
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 50px;
    overflow-y: auto;
  }
  .image-bottom {
    background-color: rgb(226, 232, 240);
    position: absolute;
    height: 50px;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
  }
}
</style>
