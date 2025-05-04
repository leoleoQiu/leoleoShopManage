<script setup>
import {
  Operation,
  Pointer,
  Flag,
  Setting,
  ArrowDown
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
const userStore = useUserStore()
</script>
<template>
  <div class="f-header">
    <div class="left">
      <div class="title">
        <el-icon><Flag /></el-icon>
        <span>后台管理</span>
      </div>
      <div class="icon">
        <el-icon><Operation /></el-icon>
        <el-icon><Pointer /></el-icon>
      </div>
    </div>
    <div class="right">
      <div class="icon">
        <el-icon><Setting /></el-icon>
      </div>
      <div class="menu">
        <el-dropdown>
          <span class="el-dropdown-link dropdown">
            <el-avatar :size="40" :src="userStore.userMenu.avatar" />
            <div>LEOLEO</div>
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.f-header {
  height: 100%;
  background-color: rgb(221, 214, 254);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  @include center;
  justify-content: space-between;
  color: grey;
  .left {
    @include center;
    margin-left: 5vw;

    .title {
      font-size: 1.5vw;
      .el-icon {
        vertical-align: top;
      }
    }
    .icon {
      margin-left: 2vw;
      /* margin-top: 5px; */
      font-size: 1vw;

      .el-icon {
        vertical-align: bottom;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
  .right {
    @include center;
    margin-right: 5vw;
    .icon {
      font-size: 1vw;
      margin-right: 20px;
      cursor: pointer;
      .el-icon {
        vertical-align: bottom;
      }
    }
    .dropdown {
      @include center;
      font-size: 1vw;
      .el-avatar {
        vertical-align: middle;
        margin-right: 10px;
      }
    }
  }
}
</style>
