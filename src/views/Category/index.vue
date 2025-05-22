<script setup>
import {
  getCategoryAPI,
  addCategoryAPI,
  editCategoryAPI,
  deleteCategoryAPI,
  updateStatusCategoryAPI
} from '@/api/category.js'
import { ref } from 'vue'
import RecommendGoods from './components/RecommendGoods.vue'
const formData = ref({
  name: ''
})
const loading = ref(false)
const tableData = ref([])
const defaultExpandedKeys = ref([])
//获取列表数据
const getCategory = async () => {
  loading.value = true
  try {
    const res = await getCategoryAPI()
    tableData.value = res.data
    defaultExpandedKeys.value = res.data.map((o) => o.id)
  } finally {
    loading.value = false
  }
}
getCategory()

const drawerRef = ref(null)
const currentID = ref(0)
//新增
const addCategory = () => {
  currentID.value = null
  //不能直接赋值，不然的话会是直接将地址赋给formData
  formData.value = { name: '' }
  drawerRef.value.open()
}
//编辑
const editCategory = (data) => {
  currentID.value = data.id
  for (let k in formData.value) {
    formData.value[k] = data[k]
  }
  drawerRef.value.open()
}
//删除
const deleteCategory = async (data) => {
  loading.value = true
  await deleteCategoryAPI(data.id)
  getCategory()
}
//修改状态
const loadingStatus = ref(false)
const StatusChange = async (status, data) => {
  loadingStatus.value = true
  try {
    await updateStatusCategoryAPI(data.id, status)
    data.status = status === 0 ? 0 : 1
    formData.value.status = status === 0 ? 0 : 1
  } finally {
    loadingStatus.value = false
  }
}
//提交表单
const submitForm = async () => {
  loading.value = true
  try {
    if (!currentID.value) {
      await addCategoryAPI(formData.value)
    } else {
      await editCategoryAPI(currentID.value, formData.value)
    }
    await getCategory()
  } finally {
    loading.value = false
    drawerRef.value.close()
  }
}

//关联商品
const recommendRef = ref(null)
const recommendCategory = (data) => {
  recommendRef.value.open(data.id)
}
</script>
<template>
  <el-card v-loading="loading">
    <div style="display: flex; justify-content: space-between">
      <PageHeader
        buttonTitle="新增分类"
        @create="addCategory"
        @refresh="getCategory"
      ></PageHeader>
    </div>
    <el-tree
      :data="tableData"
      :props="{ label: 'name', children: 'child' }"
      nodeKey="id"
      :defaultExpandedKeys="defaultExpandedKeys"
    >
      <template #default="{ data }">
        <div class="custom-tree-node">
          <div class="left">
            <el-icon v-if="data.icon" :size="20" style="margin-right: 5px">
              <component :is="data.icon"></component>
            </el-icon>
            <span>{{ data.name }}</span>
          </div>
          <div class="right" @click.stop="() => {}">
            <el-button type="primary" text @click.stop="recommendCategory(data)"
              >推荐商品</el-button
            >
            <el-switch
              v-loading="loadingStatus"
              :modelValue="data.status"
              :activeValue="1"
              :inactiveValue="0"
              @change="StatusChange($event, data)"
            ></el-switch>
            <el-button type="primary" text @click.stop="editCategory(data)"
              >修改</el-button
            >
            <el-button type="primary" text @click.stop="deleteCategory(data)"
              >删除</el-button
            >
          </div>
        </div>
      </template>
    </el-tree>
    <FormDrawer ref="drawerRef" @submit="submitForm" title="添加分类">
      <el-form :model="formData" label-width="auto">
        <el-form-item label="分类名称">
          <el-input v-model="formData.name" />
        </el-form-item>
      </el-form>
    </FormDrawer>
    <RecommendGoods ref="recommendRef"></RecommendGoods>
  </el-card>
</template>
<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  .left {
    display: flex;
    align-items: center;
  }
}
:deep(.el-tree-node__content) {
  padding: 15px 0;
}
</style>
