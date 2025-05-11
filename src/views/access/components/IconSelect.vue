<script setup>
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const iconList = Object.keys(ElementPlusIconsVue)
const model = defineModel()
</script>
<template>
  <div
    v-if="model"
    style="display: flex; align-items: center; margin-right: 5px"
  >
    <el-icon :size="25">
      <component :is="model"></component>
    </el-icon>
  </div>
  <div v-else style="min-width: 25px; margin-right: 5px"></div>
  <el-select
    filterable
    v-model="model"
    placeholder="选择图标"
    size="large"
    style="width: 240px"
  >
    <el-option v-for="item in iconList" :key="item" :label="item" :value="item">
      <div
        style="
          font-size: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <el-icon>
          <component :is="item"></component>
        </el-icon>
        <span>
          {{ item }}
        </span>
      </div>
    </el-option>
  </el-select>
</template>
