<script setup>
import FHeader from './components/FHeader.vue'
import FAside from './components/FAside.vue'
import FMain from './components/FMain.vue'
</script>
<template>
  <el-container>
    <el-header>
      <f-header></f-header>
    </el-header>
    <el-container>
      <el-aside>
        <f-aside></f-aside>
      </el-aside>
      <el-container>
        <el-header><f-main></f-main></el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<style>
.el-header {
  padding: 0;
}
</style>
