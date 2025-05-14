<script setup>
import { ref, useSlots } from 'vue'
const isShowCate = ref(false)
defineProps({
  searchForm: Object
})
const slots = useSlots()
</script>
<template>
  <el-form :model="searchForm">
    <el-row>
      <slot></slot>
      <template v-if="isShowCate"><slot name="show"></slot></template>
      <el-col :span="8" :offset="isShowCate ? 0 : 8">
        <div style="display: flex; justify-content: flex-end">
          <el-button type="primary" @click="$emit('OnSearch')">搜索</el-button>
          <el-button @click="$emit('resetSearchWord')">重置</el-button>
          <el-button
            text
            @click="isShowCate = !isShowCate"
            type="primary"
            v-if="slots.show"
          >
            {{ isShowCate ? '收起' : '展开' }}
            <el-icon>
              <ArrowDownBold v-if="!isShowCate" />
              <ArrowUpBold v-else />
            </el-icon>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>
