<script setup>
defineProps({
  title: String,
  Tab: String,
  shopData: Array
})
</script>
<template>
  <el-card class="card" shadow="hover" style="min-height: 240px">
    <template #header>
      <div class="card-header">
        <span style="font-weight: 500">{{ title }}</span>
        <el-tag type="danger">{{ Tab }}</el-tag>
      </div>
    </template>
    <el-row :gutter="15">
      <el-col :span="6" v-for="item in shopData" :key="item.label">
        <el-card class="sub-card" shadow="hover">
          <div
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              min-height: 100%;
            "
          >
            <span class="value">{{ item.value }}</span>
            <p class="label">{{ item.label }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>
<style lang="scss" scoped>
.home {
  .card {
    .card-header {
      display: flex;
      justify-content: space-between;
    }
    .sub-card {
      .value {
        font-size: 32px;
        height: 30px;
        font-weight: 700;
      }
      .label {
        color: rgb(161, 161, 170);
        margin-top: 30px;
      }
    }
  }
}
</style>
