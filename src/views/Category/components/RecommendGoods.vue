<script setup>
import { ref } from 'vue'
import {
  recommemdCategoryAPI,
  deleterecommemdCategoryAPI,
  connectCategoryAPI
} from '@/api/category.js'
import RecommendChoose from './RecommendChoose.vue'
const drawerRef = ref(null)
const category_id = ref(0)
const tableData = ref([])
const loading = ref(false)
const getRocommendData = async () => {
  loading.value = true
  const res = await recommemdCategoryAPI(category_id.value)
  tableData.value = res.data
  loading.value = false
}
const open = (id) => {
  category_id.value = id
  drawerRef.value.open()
  getRocommendData()
}

const deleteGoods = async (scope) => {
  await deleterecommemdCategoryAPI(scope.row.id)
  ElMessage.success('成功删除')
  getRocommendData()
}
defineExpose({
  open
})
//选择关联
const ChooseRef = ref(null)
const recommendChoose = () => {
  ChooseRef.value.open()
}
const submitChoose = async (ids) => {
  await connectCategoryAPI({
    category_id: category_id.value,
    goods_ids: ids
  })
  getRocommendData()
}
</script>
<template>
  <FormDrawer
    title="推荐商品"
    ref="drawerRef"
    destroyOnClose
    @submit="recommendChoose"
  >
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="name" label="商品封面" align="center">
        <template #default="scope">
          <el-image
            style="width: 80px; height: 80px"
            :src="scope.row.cover"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="商品名称"
        align="center"
        width="350"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button text type="danger" @click="deleteGoods(scope)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <RecommendChoose
      ref="ChooseRef"
      @submitChoose="submitChoose"
    ></RecommendChoose>
  </FormDrawer>
</template>
