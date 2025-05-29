<script setup>
import { useUserStore } from '@/stores/index'
const userStore = useUserStore()
defineProps({
  data: Object
})
const emit = defineEmits(['success'])
const UploadSuccess = (response) => {
  console.log(response)
  ElMessage({
    message: '上传成功',
    type: 'success'
  })
  emit('success')
}
const UploadError = (response) => {
  console.log(response)
  ElMessage({
    message: '上传失败',
    type: 'error'
  })
}
const urlAPI = import.meta.env.VITE_APP_BASE_API + '/admin/image/upload'
</script>
<template>
  <el-upload
    class="upload-demo"
    drag
    :action="urlAPI"
    multiple
    method="post"
    name="img"
    :headers="{
      token: userStore.token
    }"
    :data="{
      image_class_id: data.image_class_id
    }"
    :on-success="UploadSuccess"
    :on-error="UploadError"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      <em>通过点击或者拖拽上传</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>
</template>
