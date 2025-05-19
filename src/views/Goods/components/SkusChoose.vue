<script setup>
import { ref } from 'vue'
import { getSkusListAPI } from '@/api/skus.js'
const dialogVisible = ref(false)
const currentPage = ref(1)
const total = ref(0)
const skusList = ref([])
const activeItem = ref(0)
const open = async () => {
  dialogVisible.value = true
}
const close = () => {
  dialogVisible.value = false
}
const getSkus = async (page = 1) => {
  currentPage.value = page
  const res = await getSkusListAPI(currentPage.value)
  total.value = res.data.totalCount
  skusList.value = res.data.list
  ActiveChange(skusList.value[0].id)
}
const list = ref([])
const form = ref({
  name: '',
  checkList: []
})
//设置当前项目
const ActiveChange = (id) => {
  activeItem.value = id
  list.value = skusList.value.find((o) => o.id === id).default.split(',')
  form.value.name = skusList.value.find((o) => o.id === id).name
}
getSkus()
//提交
const emit = defineEmits(['submitChoose'])
const submit = () => {
  emit('submitChoose', form.value)
  dialogVisible.value = false
}
defineExpose({
  open,
  close
})
</script>
<template>
  <el-dialog v-model="dialogVisible" width="75%">
    <el-container class="image-body" :style="{ height: '70vh' }">
      <el-header class="image-header" style="border-bottom: 1px solid black">
        <h2>规则选择</h2>
      </el-header>
      <el-container class="image-main">
        <el-aside class="image-aside">
          <div class="image-top">
            <div
              class="aside-list"
              :class="{ active: activeItem === item.id }"
              v-for="item in skusList"
              :key="item.id"
              @click="ActiveChange(item.id)"
            >
              <div class="text">{{ item.name }}</div>
            </div>
          </div>
          <div class="image-bottom">
            <el-pagination
              background
              layout="prev, next"
              v-model:current-page="currentPage"
              :total="total"
              @update:current-page="getSkus"
            />
          </div>
        </el-aside>
        <el-main>
          <el-checkbox-group v-model="form.checkList">
            <el-checkbox
              v-for="item in list"
              :key="item"
              :label="item"
              :value="item"
              border
            />
          </el-checkbox-group>
        </el-main>
      </el-container>
    </el-container>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.image-aside {
  position: relative;
  .image-top {
    background-color: rgb(244, 244, 245);
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 50px;
    overflow-y: auto;
  }
  .image-bottom {
    background-color: rgb(226, 232, 240);
    position: absolute;
    height: 50px;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
  }
}
.active {
  background-color: rgb(198, 226, 255);
}
.aside-list {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
  &:hover {
    background-color: rgb(198, 226, 255);
  }
  .text {
    font-weight: 300;
    margin: 10px;
    flex: 1;
    text-wrap: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
