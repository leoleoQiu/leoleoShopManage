<script setup>
import { getOrderAPI, deleteLotOrderAPI } from '@/api/order.js'
import { getCategoryAPI } from '@/api/category.js'
import { ref } from 'vue'
import ImageChoose from '@/views/Manager/components/ImageChoose.vue'
import ContentModule from '@/views/Goods/components/ContentModule.vue'
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
//编辑
const RowId = ref(null)
const handleEdit = async (row) => {
  drawerTitle.value = '编辑'
  RowId.value = row.row.id
  for (let key in formData.value) {
    if (key === 'role_id') {
      formData.value[key] = row.row.role.id
    } else {
      formData.value[key] = row.row[key]
    }
  }
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
//商品分类
const categoryList = ref([])
const getCategory = async () => {
  const res = await getCategoryAPI()
  categoryList.value = res.data
}
getCategory()
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
        <PageHeader layout="">
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
              <el-button text type="primary" @click="handleEdit(scope)">
                订单详情
              </el-button>
              <el-button text type="primary" v-if="searchForm.tab === 'noship'"
                >订单发货</el-button
              >
              <el-button
                text
                type="primary"
                v-if="searchForm.tab === 'refunding'"
                >同意退款</el-button
              >
              <el-button
                text
                type="danger"
                v-if="searchForm.tab === 'refunding'"
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
      <el-form
        ref="formRef"
        :model="formData"
        label-position="right"
        label-width="auto"
      >
        <el-form-item label="用户名">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="封面">
          <ImageChoose v-model="formData.cover"></ImageChoose>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select
            v-model="formData.category_id"
            placeholder="请选择商品分类"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="选填商品分类"
            v-model="formData.desc"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="formData.unit"></el-input>
        </el-form-item>
        <el-form-item label="总库存">
          <el-input v-model="formData.stock">
            <template #append>件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="库存预警">
          <el-input v-model="formData.min_stock">
            <template #append>件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最低销售价">
          <el-input v-model="formData.min_price">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最低原价">
          <el-input v-model="formData.min_oprice">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="库存显示">
          <el-radio-group v-model="formData.stock_display">
            <el-radio :value="0" size="large">隐藏</el-radio>
            <el-radio :value="1" size="large">显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否上架">
          <el-radio-group v-model="formData.status">
            <el-radio :value="0" size="large">放入仓库</el-radio>
            <el-radio :value="1" size="large">立即上架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </FormDrawer>
    <ContentModule ref="contentDrawer"></ContentModule>
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
