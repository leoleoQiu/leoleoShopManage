<script setup>
import SkusCardItem from './SkusCardItem.vue'
import {
  skusCardList,
  addSkusCard,
  exitSkusGoods,
  deleteSkusGoods,
  sortSkusGoods
} from '@/composables/SkusCard.js'
</script>
<template>
  <el-form-item label="规则选项">
    <el-card
      shadow="never"
      style="width: 100%"
      v-for="(item, index) in skusCardList"
      :key="item.id"
      v-loading="item.loading"
    >
      <template #header>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <el-input
            style="width: 300px"
            v-model="item.text"
            @change="exitSkusGoods(item)"
          >
            <template #append>
              <el-icon><more /></el-icon>
            </template>
          </el-input>
          <div class="icon" style="display: flex; align-items: center">
            <el-button
              @click="sortSkusGoods('up', index)"
              :disabled="index === 0"
            >
              <el-icon><Top /></el-icon>
            </el-button>
            <el-button
              @click="sortSkusGoods('down', index)"
              :disabled="index === skusCardList.length - 1"
            >
              <el-icon><Bottom /></el-icon>
            </el-button>
            <el-button @click="deleteSkusGoods(item)">
              <el-icon><DeleteFilled /></el-icon>
            </el-button>
          </div>
        </div>
      </template>
      <SkusCardItem
        :skusCardItemId="item.id"
        :skusCardItemValue="item.goodsSkusCardValue"
      ></SkusCardItem>
    </el-card>
  </el-form-item>
  <el-button type="success" @click="addSkusCard">添加选项</el-button>
</template>
<style lang="scss" scoped></style>
