<script setup>
defineProps({
  buttonTitle: String
})
</script>
<template>
  <el-button type="primary" @click="$emit('create')">{{
    buttonTitle
  }}</el-button>
  <div class="icon" @click="$emit('refresh')" style="cursor: pointer">
    <el-icon><Refresh /></el-icon>
  </div>
</template>
