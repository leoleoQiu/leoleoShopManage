<script setup>
import { ref } from 'vue'
import AsideList from './AsideList.vue'
import {
  getPictureAPI,
  AddPictureAPI,
  EditPictureAPI,
  DeletePictureAPI
} from '@/api/picture'
const pictureList = ref([])
//设置当前选中的
const activeItem = ref(0)
const loading = ref(false)
//分页
const currentPage = ref(1)
const total = ref(0)
const getPicture = async (page = 1) => {
  loading.value = true
  currentPage.value = page
  try {
    const res = await getPictureAPI(currentPage.value)
    pictureList.value = res.data.list
    total.value = res.data.totalCount
    const item = res.data.list[0].id
    ActiveChange(item)
  } finally {
    loading.value = false
  }
}
getPicture()
//抽屉组件
const drawerRef = ref(null)
const formRef = ref(null)
const proID = ref(0)
const formData = ref({
  name: '',
  order: 50
})
const rules = {
  name: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur'
    }
  ]
}
//新增
const onAdd = () => {
  proID.value = 0
  formData.value.name = ''
  formData.value.order = 50
  drawerRef.value.open()
}
//编辑
const onEdit = (row) => {
  proID.value = row.id
  formData.value.name = row.name
  formData.value.order = row.order
  drawerRef.value.open()
}
//删除
const onDelete = async (id) => {
  loading.value = true
  try {
    await DeletePictureAPI(id)
    ElMessage({
      message: '成功删除',
      type: 'success'
    })
  } finally {
    loading.value = false
  }
}
//提交表单
const onSubmit = async () => {
  await formRef.value.validate()
  try {
    drawerRef.value.handleLoading()
    if (!proID.value) {
      await AddPictureAPI(formData.value)
      ElMessage({
        message: '添加成功',
        type: 'success'
      })
    } else {
      await EditPictureAPI(
        proID.value,
        formData.value.name,
        formData.value.order
      )
      ElMessage({
        message: '修改成功',
        type: 'success'
      })
    }
    getPicture()
  } finally {
    drawerRef.value.handleLoadingClose()
    drawerRef.value.close()
  }
}
// 列表改变
const emit = defineEmits(['activeChange'])
const ActiveChange = (id) => {
  activeItem.value = id
  emit('activeChange', id)
}
defineExpose({
  onAdd
})
</script>
<template>
  <el-aside width="250px" class="image-aside" v-loading="loading">
    <div class="image-top">
      <AsideList
        v-for="item in pictureList"
        :title="item.name"
        :key="item.id"
        :active="activeItem === item.id"
        @edit="onEdit(item)"
        @delete="onDelete(item.id)"
        @click="ActiveChange(item.id)"
      ></AsideList>
      <AsideList title="模拟很长很长很长很长的文案"></AsideList>
    </div>
    <div class="image-bottom">
      <el-pagination
        background
        layout="prev, next"
        v-model:current-page="currentPage"
        :total="total"
        @update:current-page="getPicture"
      />
    </div>
  </el-aside>
  <FormDrawer @submit="onSubmit" ref="drawerRef" title="新增">
    <el-form
      style="max-width: 600px"
      label-width="80"
      ref="formRef"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="图片名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number
          v-model="formData.order"
          :min="1"
          :max="500"
          @change="handleChange"
        />
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>
<style lang="scss" scoped>
.image-aside {
  position: relative;
  border: 1px solid black;
  .image-top {
    background-color: rgb(244, 244, 245);
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 50px;
    overflow-y: auto;
  }
  .image-bottom {
    background-color: rgb(226, 232, 240);
    position: absolute;
    height: 50px;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
  }
}
</style>
