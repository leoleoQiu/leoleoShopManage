<script setup>
import { ref } from 'vue'
import { readBannerAPI, editGoodsAPI } from '@/api/goods.js'
const drawer = ref(null)
const currendId = ref(null)
const formData = ref({
  content: ''
})
const open = async (row) => {
  currendId.value = row.id
  const res = await readBannerAPI(row.id)
  formData.value.content = res.data.content
  drawer.value.open()
}
const close = () => {
  drawer.value.close()
}
const confirmSubmit = async () => {
  drawer.value.handleLoading()
  try {
    await editGoodsAPI(currendId.value, formData.value)
    drawer.value.close()
    ElMessage.success('成功修改商品详情')
  } finally {
    drawer.value.handleLoadingClose()
  }
}
defineExpose({
  open,
  close
})
</script>
<template>
  <FormDrawer ref="drawer" @submit="confirmSubmit" destroyOnClose>
    <template #header>
      <h4>设置商品详情</h4>
    </template>
    <template #default>
      <el-form :model="formData">
        <el-form-item>
          <EditorModule v-model="formData.content"></EditorModule>
        </el-form-item>
      </el-form>
    </template>
  </FormDrawer>
</template>
