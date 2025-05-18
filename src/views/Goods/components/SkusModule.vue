<script setup>
import { ref } from 'vue'
import { readBannerAPI, updateSkusGoodsAPI } from '@/api/goods.js'
import SkusCard from './SkusCard.vue'
import { goodsId, initSkusCard, SkusLoading } from '@/composables/SkusCard.js'
const drawer = ref(null)
const formData = ref({
  sku_type: 0,
  sku_value: {
    oprice: 0,
    pprice: 0,
    cprice: 0,
    weight: 0,
    volume: 0
  }
})
const open = async (row) => {
  goodsId.value = row.id
  const res = await readBannerAPI(row.id)
  formData.value.sku_type = res.data.sku_type
  formData.value.sku_value = res.data.sku_value || {
    oprice: 0,
    pprice: 0,
    cprice: 0,
    weight: 0,
    volume: 0
  }
  initSkusCard(res.data)
  drawer.value.open()
}
const close = () => {
  drawer.value.close()
}
const confirmSubmit = async () => {
  drawer.value.handleLoading()
  try {
    await updateSkusGoodsAPI(goodsId.value, formData.value)
    drawer.value.close()
    ElMessage.success('成功修改商品规则')
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
  <FormDrawer
    ref="drawer"
    @submit="confirmSubmit"
    destroyOnClose
    title="商品规则修改"
  >
    <template #default>
      <el-form :model="formData" v-loading="SkusLoading">
        <el-form-item label="规格类型">
          <el-radio-group v-model="formData.sku_type">
            <el-radio :value="0" size="large">单规格</el-radio>
            <el-radio :value="1" size="large">多规格</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="formData.sku_type === 0">
          <el-form-item label="市场价格">
            <el-input v-model="formData.sku_value.oprice">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销售价格">
            <el-input v-model="formData.sku_value.pprice">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="成本价格">
            <el-input v-model="formData.sku_value.cprice">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="formData.sku_value.weight">
              <template #append>公斤</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品体积">
            <el-input v-model="formData.sku_value.volume">
              <template #append>立方米</template>
            </el-input>
          </el-form-item>
        </template>
        <template v-else>
          <SkusCard></SkusCard>
        </template>
      </el-form>
    </template>
  </FormDrawer>
</template>
