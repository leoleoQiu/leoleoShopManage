<script setup>
import { ref } from 'vue'
import { getHomeDataAPI, getShopDataAPI } from '@/api/home.js'
import EchartShow from './components/EchartsShow.vue'
import ShopShow from './components/ShopShow.vue'
const panels = ref([])
const getHomeData = async () => {
  const res = await getHomeDataAPI()
  panels.value = res.data.panels
}
getHomeData()

//商铺信息
const ShopList = ref([])
const getShopData = async () => {
  const res = await getShopDataAPI()
  console.log(res)
  ShopList.value = res.data
}
getShopData()
</script>
<template>
  <div class="home">
    <el-row :gutter="20">
      <template v-if="panels.length === 0">
        <el-col :sm="12" :lg="6" v-for="item in 4" :key="item">
          <el-skeleton style="width: 100%">
            <template #template>
              <el-card style="max-width: 480px; min-height: 150px" class="card">
                <template #header>
                  <div class="card-header">
                    <el-skeleton-item variant="text" style="width: 30%" />
                    <el-skeleton-item variant="text" style="width: 10%" />
                  </div>
                </template>
                <el-skeleton-item variant="text" style="width: 50%" />
                <template #footer>
                  <el-skeleton-item variant="text" style="width: 50%" />
                </template>
              </el-card>
            </template>
          </el-skeleton>
        </el-col>
      </template>

      <el-col :sm="12" :lg="6" v-for="item in panels" :key="item.title">
        <el-card
          style="max-width: 480px; min-height: 150px"
          class="card"
          shadow="hover"
        >
          <template #header>
            <div class="card-header">
              <span style="font-weight: 500">{{ item.title }}</span>
              <el-tag :type="item.unitColor">{{ item.unit }}</el-tag>
            </div>
          </template>
          <span class="Value">
            <NumberRoll :value="item.value"></NumberRoll>
          </span>
          <template #footer
            ><span>{{ item.subTitle }}---{{ item.subValue }}</span></template
          >
        </el-card>
      </el-col>
    </el-row>

    <IndexNav></IndexNav>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <EchartShow v-permission="['getStatistics3,GET']"></EchartShow>
      </el-col>
      <el-col :span="12">
        <ShopShow
          title="商铺"
          Tab="商品展示"
          :shopData="ShopList.goods"
        ></ShopShow>
        <ShopShow
          style="margin-top: 5px"
          title="订单"
          Tab="订单展示"
          :shopData="ShopList.order"
        ></ShopShow>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.home {
  .card {
    .card-header {
      display: flex;
      justify-content: space-between;
    }
    :deep(.el-card__body) {
      min-height: 80px;
      line-height: 80px;
      .Value {
        font-size: 32px;
        font-weight: 700;
        color: rgb(113, 113, 122);
      }
    }
  }
}
</style>
