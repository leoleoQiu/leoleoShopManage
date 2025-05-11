<script setup>
import {
  getRuleListAPI,
  addRuleListAPI,
  editRuleListAPI
} from '@/api/access.js'
import { ref } from 'vue'
const formData = ref({
  rule_id: 0,
  menu: 1,
  name: '',
  condition: '',
  method: 'GET',
  status: 1,
  order: 50,
  icon: '',
  frontpath: ''
})
const defaultForm = {
  rule_id: 0,
  menu: 1,
  name: '',
  condition: '',
  method: 'GET',
  status: 1,
  order: 50,
  icon: '',
  frontpath: ''
}
const options = ref([])
const loading = ref(false)
const tableData = ref([])
const defaultExpandedKeys = ref([])
//获取列表数据
const getRuleList = async () => {
  loading.value = true
  try {
    const res = await getRuleListAPI()
    console.log(res)
    tableData.value = res.data.list
    options.value = res.data.rules
    defaultExpandedKeys.value = res.data.list.map((o) => o.id)
  } finally {
    loading.value = false
  }
}
getRuleList()

const drawerRef = ref(null)
const currentID = ref(0)
//新增
const addRule = () => {
  currentID.value = null
  formData.value = defaultForm
  drawerRef.value.open()
}
//编辑
const editRule = (data) => {
  currentID.value = data.id
  for (let k in defaultForm) {
    formData.value[k] = data[k]
  }
  drawerRef.value.open()
}
//提交表单
const submitForm = async () => {
  loading.value = true
  try {
    if (!currentID.value) {
      await addRuleListAPI(formData.value)
    } else {
      await editRuleListAPI(currentID.value, formData.value)
    }
    await getRuleList()
  } finally {
    loading.value = false
    drawerRef.value.close()
  }
}
</script>
<template>
  <el-card v-loading="loading">
    <div style="display: flex; justify-content: space-between">
      <PageHeader
        buttonTitle="新增权限"
        @create="addRule"
        @refresh="getRuleList"
      ></PageHeader>
    </div>
    <el-tree
      :data="tableData"
      :props="{ label: 'name', children: 'child' }"
      nodeKey="id"
      :defaultExpandedKeys="defaultExpandedKeys"
    >
      <template #default="{ data }">
        <div class="custom-tree-node">
          <div class="left">
            <el-tag
              :type="data.menu ? 'primary' : 'info'"
              style="margin-right: 10px"
              >{{ data.menu ? '菜单' : '权限' }}</el-tag
            >
            <el-icon v-if="data.icon" :size="20" style="margin-right: 5px">
              <component :is="data.icon"></component>
            </el-icon>
            <span>{{ data.name }}</span>
          </div>
          <div class="right">
            <el-switch
              :modelValue="data.status"
              :activeValue="1"
              :inactiveValue="0"
            ></el-switch>
            <el-button type="primary" text @click.stop="editRule(data)"
              >修改</el-button
            >
            <el-button type="primary" text>增加</el-button>
            <el-button type="primary" text>删除</el-button>
          </div>
        </div>
      </template>
    </el-tree>
    <FormDrawer ref="drawerRef" @submit="submitForm">
      <el-form :model="formData" label-width="auto">
        <el-form-item label="上级菜单">
          <el-cascader
            v-model="formData.rule_id"
            :options="options"
            :props="{
              value: 'id',
              label: 'name',
              children: 'child',
              checkStrictly: true,
              emitPath: false
            }"
            placeholder="输入上级菜单"
            clearable
          />
        </el-form-item>
        <el-form-item label="菜单/规则">
          <el-radio-group v-model="formData.menu">
            <el-radio :value="1" size="large" border>菜单</el-radio>
            <el-radio :value="0" size="large" border>规则</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="formData.name" style="width: 30%"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" v-if="formData.menu === 1">
          <el-input v-model="formData.icon"></el-input>
        </el-form-item>
        <el-form-item
          label="前端路由"
          v-if="formData.menu === 1 && formData.rule_id > 0"
        >
          <el-input v-model="formData.frontpath"></el-input>
        </el-form-item>
        <el-form-item label="后端规则" v-if="formData.menu === 0">
          <el-input v-model="formData.condition"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" v-if="formData.menu === 0">
          <el-select
            v-model="formData.method"
            placeholder="Select"
            size="large"
            style="width: 240px"
          >
            <el-option
              v-for="item in ['GET', 'POST', 'PUT', 'DELETE']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="formData.order" :min="1" :max="500" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>
<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  .left {
    display: flex;
    align-items: center;
  }
}
:deep(.el-tree-node__content) {
  padding: 15px 0;
}
</style>
