<script setup>
import TagsInput from './components/TagsInput.vue'
import {
  getSkusListAPI,
  addSkusAPI,
  deleteSkusAPI,
  editSkusAPI,
  changeSkusStatusAPI
} from '@/api/skus.js'
import { ref } from 'vue'
const SkusList = ref([])
const totalCount = ref(0)
const loading = ref(false)
const currentPage = ref(1)
const drawerTitle = ref('新增')
const getSkusList = async (page = 1) => {
  loading.value = true
  try {
    const res = await getSkusListAPI(page)
    console.log(res)
    SkusList.value = res.data.list
    totalCount.value = res.data.totalCount
  } finally {
    loading.value = false
  }
}
getSkusList()
//页面切换
const PageChange = (nowPage) => {
  currentPage.value = nowPage
  getSkusList(currentPage.value)
}

//新增
const drawerRef = ref(null)
const formRef = ref(null)
const formData = ref({
  name: '',
  status: 1,
  order: 50,
  default: ''
})
const rules = {
  name: [
    {
      required: true,
      message: '请输入信息',
      trigger: 'blur'
    }
  ],
  default: [
    {
      required: true,
      message: '请输入信息',
      trigger: 'blur'
    }
  ]
}
const addSkus = async () => {
  drawerTitle.value = '新增'
  RowId.value = null
  formData.value = { name: '', status: 1, order: 50, default: '' }
  drawerRef.value.open()
}
//编辑
const RowId = ref(null)
const handleEdit = async (row) => {
  drawerTitle.value = '编辑'
  RowId.value = row.row.id
  for (let k in formData.value) {
    formData.value[k] = row.row[k]
  }
  drawerRef.value.open()
}
//删除
const deleteSkus = async (row) => {
  try {
    loading.value = true
    await deleteSkusAPI([row.row.id])
    getSkusList(currentPage.value)
  } finally {
    loading.value = false
  }
}
//修改状态
const loadingStatus = ref(false)
const StatusChange = async (status, data) => {
  loadingStatus.value = true
  try {
    await changeSkusStatusAPI(data.id, status)
    data.status = status === 0 ? 0 : 1
  } finally {
    loadingStatus.value = false
  }
}
//提交表单
const submitForm = async () => {
  await formRef.value.validate()
  try {
    drawerRef.value.handleLoading()
    if (!RowId.value) {
      await addSkusAPI(formData.value)
    } else {
      await editSkusAPI(RowId.value, formData.value)
    }
    getSkusList(currentPage.value)
  } finally {
    drawerRef.value.handleLoadingClose()
    drawerRef.value.close()
  }
}
//选中的
const multipleSelection = ref([])
const handleSelectionChange = (arr) => {
  multipleSelection.value = arr.map((o) => o.id)
}
//批量删除
const multipleTableRef = ref(null)
const handleSelectionSubmit = async () => {
  try {
    loading.value = true
    await deleteSkusAPI(multipleSelection.value)
    multipleTableRef.value.clearSelection()
    getSkusList()
    ElMessage.success('成功删除')
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <el-container class="Skus">
    <el-card shadow="hover" class="Skus-card" v-loading="loading">
      <div class="top">
        <PageHeader
          layout="create,deleteMap,refresh"
          buttonTitle="新增角色"
          @create="addSkus"
          @refresh="getSkusList(currentPage)"
          @deleteMap="handleSelectionSubmit"
        ></PageHeader>
      </div>
      <el-table
        :data="SkusList"
        stripe
        style="width: 100%"
        ref="multipleTableRef"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="规则名称" width="180" />
        <el-table-column prop="default" label="规格" align="center" />
        <el-table-column prop="order" label="排序" align="center" />
        <el-table-column label="状态" width="250">
          <template #default="scope">
            <el-switch
              :modelValue="scope.row.status"
              :activeValue="1"
              :inactiveValue="0"
              @change="(e) => StatusChange(e, scope.row)"
              :loading="loadingStatus"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button text type="primary" @click="handleEdit(scope)">
              修改
            </el-button>
            <el-popconfirm
              width="220"
              icon-color="#626AEF"
              title="你确认要删除吗?"
              @confirm="deleteSkus(scope)"
            >
              <template #reference>
                <el-button type="primary" text> 删除 </el-button>
              </template>
              <template #actions="{ confirm, cancel }">
                <el-button size="small" @click="cancel">No!</el-button>
                <el-button type="danger" size="small" @click="confirm">
                  Yes?
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <template #footer
        ><el-pagination
          style="display: flex; justify-content: center"
          background
          :page-size="10"
          layout="prev, pager, next"
          :total="totalCount"
          @update:current-page="PageChange"
      /></template>
    </el-card>
    <FormDrawer
      ref="drawerRef"
      @submit="submitForm"
      :title="drawerTitle"
      destroyOnClose
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="auto"
      >
        <el-form-item prop="name" label="规格名称">
          <el-input v-model="formData.name" style="width: 70%"></el-input>
        </el-form-item>
        <el-form-item prop="default" label="规格配置">
          <TagsInput v-model="formData.default"></TagsInput>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="formData.order" :min="1" :max="1000" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="formData.status"
            :activeValue="1"
            :inactiveValue="0"
          ></el-switch>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-container>
</template>
<style lang="scss" scoped>
.Skus {
  .Skus-card {
    width: 100%;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    :deep(.el-card__body) {
      padding-bottom: 0px;

      .el-table__row {
        height: 60px;
      }
    }
  }
}
</style>
