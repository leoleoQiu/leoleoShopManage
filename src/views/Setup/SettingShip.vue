<script setup>
import { ref } from 'vue'
import { getConfigAPI, exitConfigAPI } from '@/api/setup.js'
const formData = ref({
  ship: ''
})
const getData = async () => {
  const res = await getConfigAPI()
  console.log(res)
  for (let k in formData.value) {
    formData.value[k] = res.data[k]
  }
}
getData()

const handSave = async () => {
  await exitConfigAPI(formData.value)
  getData()
}
</script>
<template>
  <div>
    <el-card>
      <el-form label-width="auto" :model="formData">
        <el-form-item label="物流查询key">
          <div>
            <el-input v-model="formData.ship" style="width: 100%"></el-input>
            <small style="display: flex">用于查询物流信息，接口申请</small>
          </div>
        </el-form-item>

        <el-form-item label=" ">
          <el-button type="primary" @click="handSave">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
