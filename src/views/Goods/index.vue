<script setup>
import {
  getGoodsAPI,
  addGoodsAPI,
  deleteLotGoodsAPI,
  editGoodsAPI,
  changeGoodsStatusAPI
} from '@/api/goods.js'
import { getCategoryAPI } from '@/api/category.js'
import { ref } from 'vue'
import ImageChoose from '@/views/Manager/components/ImageChoose.vue'
import BannerModule from './components/BannerModule.vue'
import ContentModule from './components/ContentModule.vue'
const GoodsList = ref([])
const rolesList = ref([])
const totalCount = ref(0)
const loading = ref(false)
const currentPage = ref(1)
const drawerTitle = ref('新增')
const getGoodsList = async (page = 1, data) => {
  loading.value = true
  try {
    const res = await getGoodsAPI(page, data)
    console.log(res)
    rolesList.value = res.data.roles
    GoodsList.value = res.data.list.map((o) => {
      o.statusLoding = false
      return o
    })
    totalCount.value = res.data.totalCount
  } finally {
    loading.value = false
  }
}
getGoodsList()
//页面切换
const PageChange = (nowPage) => {
  currentPage.value = nowPage
  getGoodsList(currentPage.value)
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
const addGoods = async () => {
  drawerTitle.value = '新增'
  RowId.value = null
  formData.value = {
    title: '',
    category_id: null,
    cover: '',
    desc: '',
    unit: 'kg',
    stock: 100,
    min_stock: 10,
    status: 0,
    stock_display: 0,
    min_price: 1,
    min_oprice: 1
  }
  drawerRef.value.open()
}
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
//删除
const deleteGoods = async (row) => {
  try {
    loading.value = true
    await deleteLotGoodsAPI([row.row.id])
    getGoodsList(currentPage.value)
  } finally {
    loading.value = false
  }
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
      await addGoodsAPI(newForm)
    } else {
      await editGoodsAPI(RowId.value, formData.value)
    }
    getGoodsList(currentPage.value)
  } finally {
    drawerRef.value.handleLoadingClose()
    drawerRef.value.close()
  }
}
//搜索功能
const searchForm = ref({
  title: '',
  tab: 'all',
  category_id: null
})
const tabList = [
  {
    label: '全部',
    name: 'all'
  },
  {
    label: '审核中',
    name: 'checking'
  },
  {
    label: '出售中',
    name: 'saling'
  },
  {
    label: '已下架',
    name: 'off'
  },
  {
    label: '库存预警',
    name: 'min_stock'
  },
  {
    label: '回收站',
    name: 'delete'
  }
]
const resetSearchWord = () => {
  searchForm.value.title = ''
  searchForm.value.tab = ''
}
//搜索
const OnSearch = () => {
  getGoodsList(currentPage.value, searchForm.value)
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
//批量删除
const multipleTableRef = ref()
const handleSelectionSubmit = async () => {
  try {
    loading.value = true
    await deleteLotGoodsAPI(multipleSelection.value)
    multipleTableRef.value.clearSelection()
    getGoodsList()
    ElMessage.success('成功删除')
  } finally {
    loading.value = false
  }
}
//批量修改状态
const changeGoodsStatus = async (status) => {
  try {
    loading.value = true
    await changeGoodsStatusAPI(multipleSelection.value, status)
    multipleTableRef.value.clearSelection()
    getGoodsList()
    ElMessage.success('成功修改')
  } finally {
    loading.value = false
  }
}
//轮播图抽屉组件
const bannerDrawer = ref(null)
const handleSetBanner = (scope) => {
  bannerDrawer.value.open(scope.row)
}
//富文本编辑器抽屉组件
const contentDrawer = ref(null)
const handleSetEditor = (scope) => {
  contentDrawer.value.open(scope.row)
}
</script>
<template>
  <el-tabs v-model="searchForm.tab" @tab-change="OnSearch">
    <el-tab-pane
      v-for="item in tabList"
      :key="item.name"
      :label="item.label"
      :name="item.name"
    ></el-tab-pane>
  </el-tabs>
  <el-container class="goods">
    <el-card shadow="hover" class="goods-card" v-loading="loading">
      <search-header
        :model="searchForm"
        @OnSearch="OnSearch"
        @resetSearchWord="resetSearchWord"
        layout="have"
      >
        <el-col :span="8">
          <el-form-item label="关键词">
            <el-input
              v-model="searchForm.title"
              placeholder="商品名称"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <template #show>
          <el-col :span="8" style="padding-left: 20px">
            <el-form-item label="商品分类">
              <el-select
                v-model="searchForm.category_id"
                clearable
                placeholder="商品分类"
              >
                <el-option
                  v-for="item in categoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </template>
      </search-header>
      <div class="top">
        <PageHeader
          layout="create,refresh,deleteMap"
          buttonTitle="新增管理员"
          @create="addGoods"
          @refresh="getGoodsList(currentPage)"
          @deleteMap="handleSelectionSubmit"
        >
          <el-button
            v-if="searchForm.tab === 'all' || searchForm.tab === 'off'"
            type="primary"
            plain
            @click="changeGoodsStatus(1)"
            >上架</el-button
          >
          <el-button
            v-if="searchForm.tab === 'all'"
            type="primary"
            plain
            @click="changeGoodsStatus(0)"
            >下架</el-button
          >
        </PageHeader>
      </div>
      <el-table
        ref="multipleTableRef"
        :data="GoodsList"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品" width="300">
          <template #default="{ row }">
            <div style="display: flex">
              <div class="left" style="margin-right: 10px">
                <el-image
                  style="width: 70px; height: 70px"
                  :src="row.cover"
                  fit="cover"
                />
              </div>
              <div class="right">
                <span style="font-size: 18px">{{ row.title }}</span>
                <div>
                  <span style="color: red">{{ row.min_price }} &nbsp;</span>
                  <span>|&nbsp; {{ row.min_oprice }}</span>
                </div>
                <p style="color: rgba(0, 0, 0, 0.2)">
                  分类：{{ row.category ? row.category.name : '未分类' }}
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="sale_count"
          label="实际销量"
          align="center"
          width="80"
        />
        <el-table-column label="商品状态" width="150" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'">{{
              row.status ? '上架' : '仓库'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="审核状态"
          align="center"
          width="300"
          v-if="searchForm.tab !== 'delete'"
        >
          <template #default="{ row }">
            <div v-if="row.ischeck === 0">
              <el-button type="success" plain>审核通过</el-button>
              <el-button type="danger" plain>审核拒绝</el-button>
            </div>
            <div v-else>
              <span>{{ row.ischeck === 1 ? '通过' : '拒绝' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="stock"
          label="总库存"
          align="center"
          width="80"
        />
        <el-table-column label="Operations" align="center">
          <template #default="scope">
            <div v-if="searchForm.tab === 'delete'">
              <span>暂无操作</span>
            </div>
            <div v-else>
              <el-button text type="primary" @click="handleEdit(scope)">
                修改
              </el-button>
              <el-button text type="primary">商品规格</el-button>
              <el-button text type="primary" @click="handleSetBanner(scope)"
                >设置轮播图</el-button
              >
              <el-button text type="primary" @click="handleSetEditor(scope)"
                >商品详情</el-button
              >
              <el-popconfirm
                width="220"
                icon-color="#626AEF"
                title="你确认要删除吗?"
                @confirm="deleteGoods(scope)"
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
    <BannerModule ref="bannerDrawer"></BannerModule>
    <ContentModule ref="contentDrawer"></ContentModule>
  </el-container>
</template>
<style lang="scss" scoped>
.goods {
  .goods-card {
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
