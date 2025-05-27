<script setup>
import { getStatisticsAPI } from '@/api/distribution.js'
import { ref } from 'vue'
const list = ref([])
const getData = async () => {
  const res = await getStatisticsAPI()
  list.value = res.data.panels
}
getData()
</script>
<template>
  <el-row :gutter="20">
    <el-col :span="6" v-for="(item, index) in list" :key="item.color">
      <el-card style="min-height: 80px">
        <div style="display: flex; align-items: center">
          <div
            style="
              background-color: rgb(186, 230, 253);
              border-radius: 50%;
              width: 40px;
              aspect-ratio: 1/1;
              display: flex;
              justify-content: center;
              align-items: center;
            "
          >
            <el-icon v-if="index === 0">
              <User />
            </el-icon>
            <el-icon v-if="index === 1">
              <ShoppingCart />
            </el-icon>
            <el-icon v-if="index === 2">
              <PriceTag />
            </el-icon>
            <el-icon v-if="index === 3">
              <Clock />
            </el-icon>
          </div>

          <div style="margin-left: 10px">
            <h3>{{ item.value }}</h3>
            <span style="color: rgba(0, 0, 0, 0.2)">{{ item.label }}</span>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
