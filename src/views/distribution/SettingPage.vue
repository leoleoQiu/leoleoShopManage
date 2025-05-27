<script setup>
import { ref } from 'vue'
import { getSettingAPI, editSettingAPI } from '@/api/distribution'

const formData = ref({
  distribution_open: 1,
  store_first_rebate: 10,
  store_second_rebate: 20,
  spread_banners: [],
  is_self_brokerage: 1,
  settlement_days: 7,
  brokerage_method: 'hand'
})

const getData = async () => {
  const res = await getSettingAPI()
  for (let k in formData.value) {
    formData.value[k] = res.data[k]
  }
}
getData()

const handSave = async () => {
  await editSettingAPI({
    ...formData.value
  })
  getData()
}
</script>
<template>
  <div>
    <el-card>
      <el-form :model="formData" label-width="auto" label-position="right">
        <h4
          style="
            background-color: rgb(209, 213, 219);
            min-height: 30px;
            line-height: 30px;
            font-weight: 400;
            padding-left: 5px;
            border-radius: 5px;
          "
        >
          返佣设置
        </h4>
        <el-form-item label="一级返佣比例" style="margin-top: 20px">
          <el-input v-model="formData.store_first_rebate" style="width: 30%">
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="二级返佣比例">
          <el-input v-model="formData.store_second_rebate" style="width: 30%">
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="自购返佣">
          <el-radio-group v-model="formData.is_self_brokerage">
            <el-radio :value="0" border>关闭</el-radio>
            <el-radio :value="1" border>开启</el-radio>
          </el-radio-group>
        </el-form-item>
        <h4
          style="
            background-color: rgb(209, 213, 219);
            min-height: 30px;
            line-height: 30px;
            font-weight: 400;
            padding-left: 5px;
            border-radius: 5px;
            margin: 20px 0;
          "
        >
          结算设置
        </h4>
        <el-form-item label="结算时间">
          <el-input v-model="formData.settlement_days" style="width: 30%">
            <template #prepend>订单完成后</template>
            <template #append>天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="佣金到账方式">
          <el-radio-group v-model="formData.brokerage_method">
            <el-radio value="hand" border>手动到账</el-radio>
            <el-radio value="wx" border>自动到微信零钱</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" @click="handSave">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<style lang="scss" scoped></style>
