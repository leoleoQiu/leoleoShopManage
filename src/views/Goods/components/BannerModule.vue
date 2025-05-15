<script setup>
import { ref } from 'vue'
import ImageChoose from '@/views/Manager/components/ImageChoose.vue'
import { readBannerAPI, setBannerAPI } from '@/api/goods.js'
const drawer = ref(false)
const bannerList = ref([])
const currendId = ref(null)
const open = async (row) => {
  currendId.value = row.id
  const res = await readBannerAPI(row.id)
  bannerList.value = res.data.goodsBanner.map((o) => o.url)
  drawer.value = true
}
const close = () => {
  drawer.value = false
}
const confirmSubmit = async () => {
  await setBannerAPI(currendId.value, bannerList.value)
  drawer.value = false
}
defineExpose({
  open,
  close
})
</script>
<template>
  <el-drawer v-model="drawer">
    <template #header>
      <h4>设置轮播图</h4>
    </template>
    <template #default>
      <ImageChoose v-model="bannerList" :limit="9"></ImageChoose>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button>取消</el-button>
        <el-button type="primary" @click="confirmSubmit">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>
