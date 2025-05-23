<script setup>
import {
  getUserListAPI,
  addUserAPI,
  deleteUserAPI,
  editUserAPI,
  changeUserStatusAPI
} from '@/api/level.js'
import { ref } from 'vue'
const UserList = ref([])
const totalCount = ref(0)
const loading = ref(false)
const currentPage = ref(1)
const drawerTitle = ref('新增')
const getUserList = async (page = 1) => {
  loading.value = true
  try {
    const res = await getUserListAPI(page)
    UserList.value = res.data.list
    totalCount.value = res.data.totalCount
  } finally {
    loading.value = false
  }
}
getUserList()
//页面切换
const PageChange = (nowPage) => {
  currentPage.value = nowPage
  getUserList(currentPage.value)
}

//新增
const drawerRef = ref(null)
const formRef = ref(null)
const formData = ref({
  name: '',
  level: 100,
  status: 1,
  discount: 0,
  max_price: 0,
  max_times: 0
})
const rules = {
  name: [
    {
      required: true,
      message: '请输入信息',
      trigger: 'blur'
    }
  ]
}
const addUser = async () => {
  drawerTitle.value = '新增'
  RowId.value = null
  formData.value = {
    name: '',
    level: 100,
    status: 1,
    discount: 0,
    max_price: 0,
    max_times: 0
  }
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
const deleteUser = async (row) => {
  try {
    loading.value = true
    await deleteUserAPI(row.row.id)
    getUserList(currentPage.value)
  } finally {
    loading.value = false
  }
}
//修改状态
const loadingStatus = ref(false)
const StatusChange = async (status, data) => {
  loadingStatus.value = true
  try {
    await changeUserStatusAPI(data.id, status)
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
      await addUserAPI(formData.value)
    } else {
      await editUserAPI(RowId.value, formData.value)
    }
    getUserList(currentPage.value)
    ElMessage.success('修改成功')
    drawerRef.value.close()
  } finally {
    drawerRef.value.handleLoadingClose()
  }
}
</script>
<template>
  <el-container class="User">
    <el-card shadow="hover" class="User-card" v-loading="loading">
      <div class="top">
        <PageHeader
          buttonTitle="新增角色"
          @create="addUser"
          @refresh="getUserList(currentPage)"
        ></PageHeader>
      </div>
      <el-table :data="UserList" stripe style="width: 100%">
        <el-table-column prop="name" label="会员等级" width="180" />
        <el-table-column prop="discount" label="折扣率" align="center" />
        <el-table-column prop="level" label="等级序号" align="center" />
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
              @confirm="deleteUser(scope)"
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
    <FormDrawer ref="drawerRef" @submit="submitForm" :title="drawerTitle">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="auto"
      >
        <el-form-item prop="name" label="等级名称">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="等级权重">
          <el-input v-model="formData.level"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="formData.status"
            :activeValue="1"
            :inactiveValue="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="升级条件">
          <div>
            <small style="color: rgba(0, 0, 0, 0.8)">累计消费满：</small>
            <el-input v-model="formData.max_price" style="width: 70%">
              <template #append>元</template>
            </el-input>
            <small style="color: rgba(0, 0, 0, 0.4); display: block"
              >设置会员等级所需要的累计消费——必须大于等于0</small
            >
          </div>
          <div>
            <small style="color: rgba(0, 0, 0, 0.8)">累计次数满：</small>
            <el-input v-model="formData.max_times" style="width: 70%">
              <template #append>次</template>
            </el-input>
            <small style="color: rgba(0, 0, 0, 0.4); display: block"
              >设置会员等级所需要的购买次数——必须大于等于0</small
            >
          </div>
        </el-form-item>
        <el-form-item label="折扣率(%)">
          <div>
            <el-input v-model="formData.discount">
              <template #append>%</template>
            </el-input>
            <small style="color: rgba(0, 0, 0, 0.4)">折扣率单位为百分比</small>
          </div>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-container>
</template>
<style lang="scss" scoped>
.User {
  .User-card {
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
