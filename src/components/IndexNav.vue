<script setup>
const iconNavs = [
  {
    icon: 'user',
    title: '用户',
    path: '/user/list'
  },
  {
    icon: 'shopping-cart',
    title: '商品',
    path: '/goods/list'
  },
  {
    icon: 'tickets',
    title: '订单',
    path: '/order/list'
  },
  {
    icon: 'chat-dot-square',
    title: '评价',
    path: '/comment/list'
  },
  {
    icon: 'picture',
    title: '图库',
    path: '/image/list'
  },
  {
    icon: 'bell',
    title: '公告',
    path: '/notice/list'
  },
  {
    icon: 'set-up',
    title: '配置',
    path: '/setting/base'
  },
  {
    icon: 'files',
    title: '优惠',
    path: '/coupon/list'
  }
]
</script>
<template>
  <el-row :gutter="20" style="margin-top: 10px">
    <el-col :sm="6" :lg="3" v-for="item in iconNavs" :key="item.path">
      <el-card
        shadow="hover"
        style="cursor: pointer"
        @click="$router.push(item.path)"
      >
        <div class="card-nav">
          <component
            :is="item.icon"
            style="color: rgb(245, 208, 254); font-size: 50px"
          ></component>
          <span style="margin-top: 10px">{{ item.title }}</span>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<style scoped lang="scss">
.el-card {
  aspect-ratio: 1 !important;
  :deep(.el-card__body) {
    padding: 0 !important;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .card-nav {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 20px;
    }
  }
}
</style>
