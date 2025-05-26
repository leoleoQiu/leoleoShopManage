<script setup>
import { ref } from 'vue'
import { getConfigAPI, exitConfigAPI } from '@/api/setup.js'
const activeName = ref('first')

const formData = ref({
  open_reg: 0,
  reg_method: 'username',
  password_min: 7,
  password_encrypt: [],
  upload_method: 'oss',
  upload_config: {
    Bucket: '',
    ACCESS_KEY: '',
    SECRET_KEY: '',
    http: ''
  },
  api_safe: 1,
  api_secret: ''
})

const getData = async () => {
  const res = await getConfigAPI()
  for (let k in formData.value) {
    formData.value[k] = res.data[k]
  }
  formData.value.password_encrypt = res.data.password_encrypt.split(',')
}
getData()

const handSave = async () => {
  await exitConfigAPI({
    ...formData.value,
    password_encrypt: formData.value.password_encrypt.join(',')
  })
  getData()
}
</script>
<template>
  <div>
    <el-card>
      <el-form :model="formData" label-width="auto" label-position="right">
        <el-tabs v-model="activeName">
          <el-tab-pane label="注册与访问" name="first">
            <el-form-item label="是否允许注册会员">
              <el-radio-group v-model="formData.open_reg">
                <el-radio :value="0" size="large" border>关闭</el-radio>
                <el-radio :value="1" size="large" border>开启</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="注册类型">
              <el-radio-group v-model="formData.reg_method">
                <el-radio value="username" size="large" border>
                  普通注册
                </el-radio>
                <el-radio value="phone" size="large" border>手机注册</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="密码最小长度">
              <el-input
                v-model="formData.password_min"
                style="width: 15%"
              ></el-input>
            </el-form-item>
            <el-form-item label="强制密码复杂度">
              <el-checkbox-group v-model="formData.password_encrypt">
                <el-checkbox label="数字" value="0" border />
                <el-checkbox label="小写字母" value="1" border />
                <el-checkbox label="大写字母" value="2" border />
                <el-checkbox label="符号" value="3" border />
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="上传设置" name="second">
            <el-form-item label="默认上传方式">
              <el-radio-group v-model="formData.upload_method">
                <el-radio value="oss" border>对象存储</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Bucket">
              <el-input
                v-model="formData.upload_config.Bucket"
                placeholder="Bucket"
                style="width: 20%"
              ></el-input>
            </el-form-item>
            <el-form-item label="ACCESS_KEY">
              <el-input
                v-model="formData.upload_config.ACCESS_KEY"
                placeholder="ACCESS_KEY"
                style="width: 20%"
              ></el-input>
            </el-form-item>
            <el-form-item label="SECRET_KEY">
              <el-input
                v-model="formData.upload_config.SECRET_KEY"
                placeholder="SECRET_KEY"
                style="width: 20%"
              ></el-input>
            </el-form-item>
            <el-form-item label="空间域名">
              <el-input
                v-model="formData.upload_config.http"
                placeholder="空间域名"
                style="width: 20%"
              ></el-input>
              <small>请补全http:// or https://</small>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="API安全" name="third">
            <el-form-item label="是否开启API安全">
              <el-radio-group v-model="formData.api_safe">
                <el-radio :value="0" border>关闭</el-radio>
                <el-radio :value="1" border>开启</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="秘钥">
              <el-input
                v-model="formData.api_secret"
                style="width: 20%"
                placeholder="秘钥"
              ></el-input>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        <el-form-item label=" ">
          <el-button type="primary" @click="handSave">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<style lang="scss" scoped></style>
