<script setup>
import { ref } from 'vue'
const drawer = ref(false)
const open = () => {
  drawer.value = true
}
const close = () => {
  drawer.value = false
}
const emit = defineEmits(['submit'])
const handleSubmit = () => {
  emit('submit')
}
const props = defineProps({
  title: {
    type: String
  },
  size: {
    type: String,
    default: '45%'
  },
  destroyOnClose: {
    type: String,
    default: 'false'
  }
})

//加载
const loading = ref(false)
const handleLoading = () => {
  loading.value = true
}
const handleLoadingClose = () => {
  loading.value = false
}
defineExpose({
  open,
  close,
  handleLoading,
  handleLoadingClose
})
</script>
<template>
  <el-drawer
    v-model="drawer"
    :title="props.title"
    :size="props.size"
    :destroy-on-close="props.destroyOnClose"
  >
    <div class="form-drawer">
      <div class="body"><slot></slot></div>
      <div class="footer">
        <el-button
          color="#6272f6"
          class="button"
          @click="handleSubmit"
          :loading="loading"
          >确认修改</el-button
        >
      </div>
    </div>
  </el-drawer>
</template>
<style lang="scss">
.form-drawer {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .body {
    flex: 1;
    overflow: auto;
  }
  .footer {
    height: 50px;
  }
}
</style>
