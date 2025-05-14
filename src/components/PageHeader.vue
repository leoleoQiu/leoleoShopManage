<script setup>
import { computed } from 'vue'
const props = defineProps({
  buttonTitle: String,
  layout: {
    type: String,
    default: 'create,refresh'
  }
})
const pageShow = computed(() => props.layout.split(','))
defineEmits(['deleteMap', 'create', 'refresh'])
</script>
<template>
  <div>
    <el-button
      v-if="pageShow.includes('create')"
      type="primary"
      @click="$emit('create')"
      >{{ buttonTitle }}</el-button
    >
    <el-popconfirm
      width="220"
      icon-color="#626AEF"
      title="你确认要删除吗?"
      @confirm="$emit('deleteMap')"
    >
      <template #reference>
        <el-button v-if="pageShow.includes('deleteMap')" type="danger"
          >批量删除</el-button
        >
      </template>
      <template #actions="{ confirm, cancel }">
        <el-button size="small" @click="cancel">No!</el-button>
        <el-button type="danger" size="small" @click="confirm">
          Yes?
        </el-button>
      </template>
    </el-popconfirm>
    <slot></slot>
  </div>
  <div
    class="icon"
    v-if="pageShow.includes('refresh')"
    @click="$emit('refresh')"
    style="cursor: pointer"
  >
    <el-icon><Refresh /></el-icon>
  </div>
</template>
