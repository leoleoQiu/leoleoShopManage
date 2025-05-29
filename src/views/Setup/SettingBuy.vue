<script setup>
import { ref } from 'vue'
import { getConfigAPI, exitConfigAPI } from '@/api/setup.js'
import { useUserStore } from '@/stores'
const activeName = ref('first')
const formData = ref({
  close_order_minute: 30,
  auto_received_day: 7,
  after_sale_day: 23,
  alipay: {
    app_id: '',
    ali_public_key: '',
    private_key: ''
  },
  wxpay: {
    app_id: '',
    miniapp_id: '',
    secret: '',
    appid: '',
    mch_id: '',
    key: '',
    cert_client: '',
    cert_key: ''
  }
})
const tableData = ref([
  {
    name: '支付宝支付',
    desc: '该系统支持即时到账接口',
    key: 'alipay',
    src: '/alipay.png'
  },
  {
    name: '微信支付',
    desc: '该系统支持微信网页支付和扫码支付',
    key: 'wechat',
    src: '/wechat.png'
  }
])
const getData = async () => {
  const res = await getConfigAPI()
  console.log(res)
  for (let k in formData.value) {
    formData.value[k] = res.data[k]
  }
}
getData()

const userStore = useUserStore()
//配置支付
const payMethod = ref('alipay')
const drawer = ref(null)
const settingPay = (row) => {
  payMethod.value = row.key
  drawer.value.open()
}
//文件
const handleSuccess = (response) => {
  formData.value.wxpay.cert_client = response.data
}

const handSave = async () => {
  await exitConfigAPI({
    ...formData.value
  })
  getData()
}

const urlAPI = import.meta.env.VITE_APP_BASE_API + '/admin/sysconfig/upload'
</script>
<template>
  <div>
    <el-card>
      <el-form label-width="auto">
        <el-tabs v-model="activeName">
          <el-tab-pane label="支付设置" name="first">
            <el-table :data="tableData" border style="width: 100%" stripe>
              <el-table-column label="支付方式">
                <template #default="scope">
                  <div style="display: flex; align-items: center">
                    <img
                      :src="scope.row.src"
                      style="width: 64px; aspect-ratio: 1/1"
                    />
                    <div>
                      <p>{{ scope.row.name }}</p>
                      <span style="color: rgba(0, 0, 0, 0.2)">{{
                        scope.row.desc
                      }}</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" align="center">
                <template #default="scope">
                  <el-button type="primary" plain @click="settingPay(scope.row)"
                    >配置</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="购物设置" name="second">
            <el-form-item label="未支付订单">
              <el-input
                v-model="formData.close_order_minute"
                style="width: 30%"
              >
                <template #append>分钟后会自动关闭</template>
              </el-input>
            </el-form-item>
            <el-form-item label="已发货订单">
              <el-input v-model="formData.auto_received_day" style="width: 30%">
                <template #append>天后自动确认收货</template>
              </el-input>
            </el-form-item>
            <el-form-item label="已完成订单">
              <el-input v-model="formData.after_sale_day" style="width: 30%">
                <template #append>天内允许申请售后</template>
              </el-input>
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" @click="handSave">保存</el-button>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <FormDrawer ref="drawer" @submit="handSave">
      <el-form label-width="auto">
        <template v-if="payMethod === 'alipay'">
          <el-form-item label="app_id">
            <el-input v-model="formData.alipay.app_id"></el-input>
          </el-form-item>
          <el-form-item label="ali_public_key">
            <el-input
              v-model="formData.alipay.ali_public_key"
              type="textarea"
              :rows="5"
            ></el-input>
          </el-form-item>
          <el-form-item label="private_key">
            <el-input
              v-model="formData.alipay.private_key"
              type="textarea"
              :rows="5"
            ></el-input>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="公众号APPID">
            <el-input
              v-model="formData.wxpay.app_id"
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item label="小程序APPID">
            <el-input
              v-model="formData.wxpay.miniapp_id"
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item label="小程序secret">
            <el-input
              v-model="formData.wxpay.secret"
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item label="appid">
            <el-input
              v-model="formData.wxpay.appid"
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item label="商户号">
            <el-input
              v-model="formData.wxpay.mch_id"
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item label="API密钥">
            <el-input
              v-model="formData.wxpay.key"
              style="width: 70%"
            ></el-input>
          </el-form-item>
          <el-form-item label="cert_client">
            <el-upload
              :action="urlAPI"
              style="width: 100%"
              :limit="1"
              :headers="{
                token: userStore.token
              }"
              :on-success="handleSuccess"
            >
              <el-button type="primary">上传文件</el-button>
            </el-upload>
          </el-form-item>
        </template>
      </el-form>
    </FormDrawer>
  </div>
</template>
