<script setup>
import { getOrderAPI, deleteLotOrderAPI, refundOrderAPI } from '@/api/order.js'
import { ref } from 'vue'
import DataExport from './components/DataExport.vue'
const OrderList = ref([])
const rolesList = ref([])
const totalCount = ref(0)
const loading = ref(false)
const currentPage = ref(1)
const drawerTitle = ref('新增')
const getOrderList = async (page = 1, data) => {
  loading.value = true
  try {
    const res = await getOrderAPI(page, data)
    console.log(res)
    rolesList.value = res.data.roles
    OrderList.value = res.data.list.map((o) => {
      o.statusLoding = false
      return o
    })
    totalCount.value = res.data.totalCount
  } finally {
    loading.value = false
  }
}
getOrderList()
//页面切换
const PageChange = (nowPage) => {
  currentPage.value = nowPage
  getOrderList(currentPage.value)
}
//新增
const drawerRef = ref(null)
const formRef = ref(null)
const formData = ref({
  title: '',
  category_id: null,
  cover: '',
  desc: '',
  unit: 'kg',
  stock: 100,
  min_stock: 10,
  status: 1,
  stock_display: 1,
  min_price: 0,
  min_oprice: 0
})
const tabList = [
  {
    label: '全部',
    name: 'all'
  },
  {
    label: '待支付',
    name: 'nopay'
  },
  {
    label: '待发货',
    name: 'noship'
  },
  {
    label: '待收货',
    name: 'shiped'
  },
  {
    label: '已收货',
    name: 'received'
  },
  {
    label: '已完成',
    name: 'finish'
  },
  {
    label: '已关闭',
    name: 'closed'
  },
  {
    label: '退款中',
    name: 'refunding'
  }
]
//订单详情
const RowId = ref(null)
const info = ref({})
const handleOpen = async (row) => {
  drawerTitle.value = '订单详情'
  info.value = row
  console.log(info.value)
  drawerRef.value.open()
}
//提交表单
const submitForm = async () => {
  await formRef.value.validate()
  try {
    drawerRef.value.handleLoading()
    if (!RowId.value) {
      //遍历对象提取非空value的属性
      const newForm = {}
      for (let key in formData.value) {
        if (formData.value[key] || formData.value[key] === 0) {
          newForm[key] = formData.value[key]
        }
      }
      // await addOrderAPI(newForm)
    } else {
      // await editOrderAPI(RowId.value, formData.value)
    }
    getOrderList(currentPage.value)
  } finally {
    drawerRef.value.handleLoadingClose()
    drawerRef.value.close()
  }
}
//搜索功能
const searchForm = ref({
  tab: 'all',
  no: null,
  starttime: null,
  endtime: null,
  name: null,
  phone: null
})

const resetSearchWord = () => {
  searchForm.value.no = null
  searchForm.value.starttime = null
  searchForm.value.endtime = null
  searchForm.value.name = null
  searchForm.value.phone = null
}
//搜索
const OnSearch = () => {
  getOrderList(currentPage.value, searchForm.value)
}
//批量功能
const multipleSelection = ref([])
const handleSelectionChange = (arr) => {
  multipleSelection.value = arr.map((o) => o.id)
}
//封装函数复用
const LotFunction = async (func, msg) => {
  try {
    loading.value = true
    await func(multipleSelection.value)
    multipleTableRef.value.clearSelection()
    getOrderList(currentPage.value, searchForm.value)
    ElMessage.success(msg)
  } finally {
    loading.value = false
  }
}
//批量删除
const multipleTableRef = ref()
const handleSelectionSubmit = async () => {
  LotFunction(deleteLotOrderAPI, '成功删除')
}

//execl导出
const exportDrawer = ref(null)
const downLoad = () => {
  exportDrawer.value.open()
}

//拒绝或者同意退款
const handleRefund = async (row, agree) => {
  const obj = {
    agree
  }
  if (agree === 1) {
    await ElMessageBox.confirm('是否同意退款', '请确认', {
      confirmButtonText: '同意',
      cancelButtonText: '不同意',
      type: 'warning'
    })
  } else {
    const res = await ElMessageBox.prompt('请输入拒绝退款原因', '拒绝退款', {
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })
    obj.disagree_reason = res.value
  }
  await refundOrderAPI(row.id, obj)
  getOrderList(1, searchForm.value)
  ElMessage({
    type: 'success',
    message: '成功操作'
  })
}
</script>
<template>
  <el-container class="Order" v-loading="loading">
    <el-header>
      <el-tabs v-model="searchForm.tab" @tab-change="OnSearch">
        <el-tab-pane
          v-for="item in tabList"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        ></el-tab-pane> </el-tabs
    ></el-header>
    <el-card shadow="hover" class="Order-card">
      <search-header
        :model="searchForm"
        @OnSearch="OnSearch"
        @resetSearchWord="resetSearchWord"
        layout="have"
      >
        <el-col :span="8">
          <el-form-item label="订单号">
            <el-input
              v-model="searchForm.no"
              placeholder="订单号"
              clearable
              style="width: 90%"
            ></el-input>
          </el-form-item>
        </el-col>
        <template #show>
          <el-col :span="8">
            <el-form-item label="收货人">
              <el-input
                v-model="searchForm.name"
                placeholder="收货人"
                clearable
                style="width: 90%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号">
              <el-input
                v-model="searchForm.phone"
                placeholder="手机号"
                clearable
                style="width: 90%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="searchForm.starttime"
                type="date"
                placeholder="开始日期"
                value-format="YYYY-MM-DD"
                style="width: 90%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="searchForm.endtime"
                type="date"
                placeholder="结束日期"
                value-format="YYYY-MM-DD"
                style="width: 90%"
              />
            </el-form-item>
          </el-col>
        </template>
      </search-header>
      <div class="top">
        <PageHeader
          layout="refresh,download"
          @refresh="getOrderList"
          @download="downLoad"
        >
          <el-button type="danger" @click="handleSelectionSubmit"
            >批量删除</el-button
          >
        </PageHeader>
      </div>
      <el-table
        ref="multipleTableRef"
        :data="OrderList"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品" width="400">
          <template #default="{ row }">
            <div>
              <div class="top" style="margin-right: 10px; display: flex">
                <div class="left">
                  <p>订单号：</p>
                  <span>{{ row.no }}</span>
                </div>
                <div class="right">
                  <p>下单时间：</p>
                  <span>{{ row.create_time }}</span>
                </div>
              </div>
              <div style="display: flex; align-items: center">
                <el-image
                  style="width: 70px; height: 70px"
                  :src="row.order_items?.[0]?.goods_item?.cover"
                  fit="cover"
                />
                <h4 style="color: red">
                  {{ row.order_items[0]?.goods_item?.title }}
                </h4>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="total_price"
          label="实际付款"
          align="center"
          width="200"
        />
        <el-table-column
          prop="total_price"
          label="买家"
          align="center"
          width="250"
        >
          <template #default="{ row }">
            <div>{{ row.user.nickname }}</div>
            <div>(用户名：{{ row.user.username }})</div>
          </template>
        </el-table-column>
        <el-table-column label="交易状态" align="left" width="200">
          <template #default="{ row }">
            <div>
              付款状态：
              <el-tag v-if="row.payment_method === 'alipay'" type="primary">
                支付宝付款
              </el-tag>
              <el-tag
                v-else-if="row.payment_method === 'wechat'"
                type="success"
              >
                微信付款
              </el-tag>
              <el-tag v-else type="info"> 未付款 </el-tag>
            </div>
            <div>
              发货状态：
              <el-tag v-if="row.ship_data" type="primary"> 已发货 </el-tag>
              <el-tag v-else type="info"> 未发货 </el-tag>
            </div>
            <div>
              收货状态：
              <el-tag v-if="row.ship_status === 'received'" type="primary">
                已收获
              </el-tag>
              <el-tag v-else type="info"> 待收货 </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <div>
              <el-button text type="primary" @click="handleOpen(scope.row)">
                订单详情
              </el-button>
              <el-button text type="primary" v-if="searchForm.tab === 'noship'"
                >订单发货</el-button
              >
              <el-button
                text
                type="primary"
                v-if="searchForm.tab === 'refunding'"
                @click="handleRefund(scope.row, 1)"
                >同意退款</el-button
              >
              <el-button
                text
                type="danger"
                v-if="searchForm.tab === 'refunding'"
                @click="handleRefund(scope.row, 0)"
                >拒绝退款</el-button
              >
            </div>
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
    <!-- 抽屉组件 -->
    <FormDrawer ref="drawerRef" @submit="submitForm" :title="drawerTitle">
      <el-card style="margin-bottom: 20px">
        <template #header>
          <strong>订单详情</strong>
        </template>
        <el-form label-width="auto" label-position="right">
          <el-form-item label="订单号"> {{ info.no }} </el-form-item>
          <el-form-item label="付款方式">
            {{ info.payment_method }}
          </el-form-item>
          <el-form-item label="付款时间"> {{ info.paid_time }} </el-form-item>
          <el-form-item label="创建时间">
            {{ info.payment_method }}
          </el-form-item>
        </el-form>
      </el-card>

      <el-card style="margin-bottom: 20px">
        <template #header>
          <strong>商品详情</strong>
        </template>
        <div style="display: flex; align-items: center">
          <el-image
            style="width: 100px; height: 100px"
            :src="info.order_items[0].goods_item.cover"
            fit="cover"
          />
          <div style="margin-left: 20px">
            <p>{{ info.order_items[0].goods_item.title }}</p>
            <div>
              <span style="color: red"
                >￥{{ info.order_items[0].price }}&nbsp;</span
              >
              <i>*1</i>
            </div>
          </div>
        </div>
      </el-card>

      <el-card>
        <template #header>
          <strong>订单详情</strong>
        </template>
        <el-form label-width="auto" label-position="right">
          <el-form-item label="收货人"> {{ info.address.name }} </el-form-item>
          <el-form-item label="联系方式">
            {{ info.address.phone }}
          </el-form-item>
          <el-form-item label="收货地址">
            {{ info.address.address }}
          </el-form-item>
        </el-form>
      </el-card>
    </FormDrawer>
    <DataExport ref="exportDrawer" :tabs="tabList"></DataExport>
  </el-container>
</template>
<style lang="scss" scoped>
.Order {
  .Order-card {
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
