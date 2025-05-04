<script setup>
import { ref } from 'vue'
import {
  Operation,
  Pointer,
  Flag,
  Setting,
  ArrowDown
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import fromDrawer from '@/components/FormDrawer.vue'
const userStore = useUserStore()

// 退出登录
import { layoutAPI } from '@/api/login'
import { useRouter } from 'vue-router'
const router = useRouter()
const handleExit = () => {
  // 退出登录逻辑
  ElMessageBox.confirm('你确定要退出么?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await layoutAPI()
      await userStore.removeToken()
      router.push('/login')
    })
    .catch(() => {})
}
//修改密码
import { User, Lock } from '@element-plus/icons-vue'
import { repasswordAPI } from '@/api/login'
const ruleForm = ref({
  username: '',
  password: '',
  repassword: ''
})
const forms = ref()
const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== ruleForm.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})
const repasswordHandle = async () => {
  try {
    await forms.value.validate()
    FormDrawer.value.handleLoading()
    await repasswordAPI(ruleForm.value)
    ElMessage({
      message: '修改成功',
      type: 'success'
    })
  } finally {
    FormDrawer.value.handleLoadingClose()
  }
}
const FormDrawer = ref()
const handleCommand = (command) => {
  switch (command) {
    case 'password':
      // drawer.value = true
      FormDrawer.value.open()
      break
    case 'exit':
      handleExit()
      break
  }
}
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
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link dropdown">
            <el-avatar :size="40" :src="userStore.userMenu.avatar" />
            <div>LEOLEO</div>
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="password">修改密码</el-dropdown-item>
              <el-dropdown-item command="exit">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- <el-drawer v-model="drawer" title="修改密码">
    </el-drawer> -->
    <fromDrawer ref="FormDrawer" title="修改密码" @submit="repasswordHandle">
      <el-form
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        ref="forms"
        label-position="top"
      >
        <el-form-item label="用户" prop="username">
          <el-input v-model="ruleForm.username">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password">
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
          <el-input type="password" v-model="ruleForm.repassword">
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </fromDrawer>
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
