<script setup>
import {
  getCouponListAPI,
  addCouponAPI,
  deleteCouponAPI,
  editCouponAPI,
  changeCouponStatusAPI
} from '@/api/coupon'
import { ref, computed } from 'vue'
const CouponList = ref([])
const totalCount = ref(0)
const loading = ref(false)
const currentPage = ref(1)
const drawerTitle = ref('新增')
const getCouponList = async (page = 1) => {
  loading.value = true
  try {
    const res = await getCouponListAPI(page)
    CouponList.value = res.data.list.map((o) => {
      const now = +new Date()
      const startTime = new Date(o.start_time)
      const endTime = new Date(o.end_time)
      if (startTime > now) {
        o.statusText = '未开始'
      } else if (now > endTime) {
        o.statusText = '已过期'
      } else if (o.stuatus === 0) {
        o.statusText = '已失效'
      } else {
        o.statusText = '领取中'
      }
      return o
    })
    console.log(res)
    totalCount.value = res.data.totalCount
  } finally {
    loading.value = false
  }
}
getCouponList()
//页面切换
const PageChange = (nowPage) => {
  currentPage.value = nowPage
  getCouponList(currentPage.value)
}

//新增
const drawerRef = ref(null)
const formRef = ref(null)
const formData = ref({
  name: '',
  type: 0,
  value: 0,
  total: 0,
  min_price: 0,
  start_time: '',
  end_time: '',
  order: 50
})
const addCoupon = async () => {
  drawerTitle.value = '新增'
  RowId.value = null
  formData.value = {
    name: '',
    type: 0,
    value: 0,
    total: 0,
    min_price: 0,
    start_time: '',
    end_time: '',
    order: 50
  }
  drawerRef.value.open()
}
const timeData = computed({
  get: () => {
    return formData.value.start_time && formData.value.end_time
      ? [formData.value.start_time, formData.value.end_time]
      : []
  },
  set: (val) => {
    formData.value.start_time = val[0]
    formData.value.end_time = val[1]
  }
})
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
const deleteCoupon = async (row) => {
  try {
    loading.value = true
    await deleteCouponAPI(row.row.id)
    getCouponList(currentPage.value)
  } finally {
    loading.value = false
  }
}
//提交表单
const submitForm = async () => {
  await formRef.value.validate()
  try {
    drawerRef.value.handleLoading()
    formData.value.start_time = +new Date(formData.value.start_time)
    formData.value.end_time = +new Date(formData.value.end_time)
    if (!RowId.value) {
      await addCouponAPI(formData.value)
    } else {
      await editCouponAPI(RowId.value, formData.value)
    }
    getCouponList(currentPage.value)
    ElMessage.success('成功修改')
  } finally {
    drawerRef.value.handleLoadingClose()
    drawerRef.value.close()
  }
}
const changeCouponStatus = async (scope) => {
  loading.value = false
  try {
    await changeCouponStatusAPI(scope.row.id, scope.row.status)
    await getCouponList()
  } finally {
    loading.value = true
  }
}
</script>
<template>
  <el-container class="Coupon">
    <el-card shadow="hover" class="Coupon-card" v-loading="loading">
      <div class="top">
        <PageHeader
          buttonTitle="新增"
          @create="addCoupon"
          @refresh="getCouponList(currentPage)"
        ></PageHeader>
      </div>
      <el-table :data="CouponList" stripe style="width: 100%">
        <el-table-column label="优惠卷名称">
          <template #default="scope">
            <div
              :class="{
                active: scope.row.statusText === '领取中',
                inactive: scope.row.statusText !== '领取中'
              }"
              style="margin-left: 5px; border-radius: 5px"
            >
              <p style="font-size: 18px; font-weight: 700; margin-left: 5px">
                {{ scope.row.name }}
              </p>
              <span style="font-size: 12px; margin-left: 5px"
                >{{ scope.row.start_time }}~{{ scope.row.end_time }}</span
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="180"
          align="center"
        />
        <el-table-column prop="status" label="优惠" align="center" width="200">
          <template #default="scope">
            <div>
              {{
                scope.row.type
                  ? '折扣' + Number(scope.row.value).toFixed(0) + '折'
                  : '满减' + scope.row.value + '元'
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="total" label="发放数量" align="center" />
        <el-table-column prop="used" label="已使用" align="center" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button
              text
              type="primary"
              @click="handleEdit(scope)"
              v-if="scope.row.statusText === '未开始'"
            >
              修改
            </el-button>
            <el-popconfirm
              v-if="scope.row.statusText !== '领取中'"
              width="220"
              icon-color="#626AEF"
              title="你确认要删除吗?"
              @confirm="deleteCoupon(scope)"
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
            <el-popconfirm
              v-if="scope.row.statusText === '领取中'"
              width="220"
              icon-color="#626AEF"
              title="你确认失效吗?"
              @confirm="changeCouponStatus(scope)"
            >
              <template #reference>
                <el-button type="danger"> 失效 </el-button>
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
      <el-form ref="formRef" :model="formData" label-width="auto">
        <el-form-item prop="name" label="优惠卷名">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item prop="type" label="类型">
          <el-radio-group v-model="formData.type">
            <el-radio :value="0" size="large">满减</el-radio>
            <el-radio :value="1" size="large">折扣</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="value" label="面值">
          <el-input v-model="formData.value" style="width: 20%">
            <template #append>{{ formData.type === 1 ? '折' : '元' }}</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="total" label="发行量">
          <el-input-number v-model="formData.total" :min="1" :max="1000" />
        </el-form-item>
        <el-form-item prop="min_price" label="最低使用价格">
          <el-input v-model="formData.min_price"></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="timeData"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetimerange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
          />
        </el-form-item>
        <el-form-item prop="order" label="排序">
          <el-input-number v-model="formData.order" :min="1" :max="1000" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-container>
</template>
<style lang="scss" scoped>
.Coupon {
  .Coupon-card {
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
  .active {
    background-color: #fff3f3;
  }
  .inactive {
    background-color: #fbfcfd;
    color: gray;
  }
}
</style>
