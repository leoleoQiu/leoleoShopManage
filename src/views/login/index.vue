<script setup>
import { ref } from 'vue'
const ruleForm = ref({
  username: '',
  password: ''
})
const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
})
</script>
<template>
  <el-row>
    <el-col :span="16" class="left">
      <div>
        <div class="title">LEOLEO后台</div>
        <div class="content">leoleoQiu的小demo 学学学学</div>
      </div>
    </el-col>
    <el-col :span="8" class="right">
      <div>
        <div class="top">
          <div
            style="
              font-size: 30px;
              color: #27272a;
              font-weight: 700;
              text-align: center;
            "
          >
            欢迎回来
          </div>
          <div class="login">
            <span></span>
            <div style="color: gray; font-size: 20px">登录</div>
            <span></span>
          </div>
        </div>
        <el-form :model="ruleForm" :rules="rules">
          <el-form-item label="用户" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button color="#6272f6" class="button">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.left {
  @include center;
  height: 100vh;
  background-image: conic-gradient(
    #fff1f2 0 25%,
    #c4b5fd 25% 50%,
    #fff1f2 50% 75%,
    #c4b5fd 75% 100%
  );
  background-size: 180px 180px;
  .title {
    font-size: 38px;
    color: #030712;
    font-weight: 700;
    font-family:
      'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
      'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  }
  .content {
    margin-top: 8px;
    font-size: 25px;
    color: #6b7280;
    font-family: 'PingFangSC-Medium, PingFang SC';
  }
}
.right {
  @include center;
  height: 100vh;
  .top {
    margin-bottom: 60px;
    .login {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        width: 8vw;
        height: 1px;
        background-color: gray;
      }
    }
  }
}

.button {
  margin: 15px auto;
  width: 50%;
  height: 40px;
  border-radius: 20px;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  background-color: #6272f6;
}
</style>
