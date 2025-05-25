<script setup>
import { ref } from 'vue'
import { exportOrderAPI } from '@/api/order.js'
const drawer = ref(false)
defineProps({
  tabs: Array
})
const open = () => {
  drawer.value = true
}
const close = () => {
  drawer.value = false
}

const formData = ref({
  tab: null,
  time: ''
})

const onSumbit = async () => {
  if (!formData.value.tab) return ElMessage.error('请选择tab类型')
  const res = await exportOrderAPI({
    tab: formData.value.tab,
    starttime: formData.value.time[0],
    endtime: formData.value.time[1]
  })
  const blob = new Blob([res])
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.download = new Date().toLocaleString() + '.xlsx'
  document.body.appendChild(a)
  a.click()
}
defineExpose({
  open,
  close
})
</script>
<template>
  <el-drawer v-model="drawer" title="导出表单">
    <el-form :model="formData">
      <el-form-item label="订单类型">
        <el-select
          v-model="formData.tab"
          placeholder="请选择"
          style="width: 40%"
        >
          <el-option
            v-for="item in tabs"
            :key="item.name"
            :label="item.label"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="formData.time"
          type="datetimerange"
          :shortcuts="shortcuts"
          range-separator="To"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onSumbit">导出</el-button>
    </template>
  </el-drawer>
</template>

<style lang="scss" setup>
.el-drawer__footer {
  text-align: left;
}
</style>
