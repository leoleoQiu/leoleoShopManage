<script setup>
import { ref } from 'vue'
import { getGoodsAPI } from '@/api/goods.js'
const dialogVisible = ref(null)
const GoodsList = ref([])
const getList = async () => {
  const res = await getGoodsAPI(1, { tab: 'all' })
  GoodsList.value = res.data.list
}
getList()
const open = () => {
  dialogVisible.value = true
}
defineExpose({
  open
})
const SelectionId = ref()
const handleSelectionChange = (arr) => {
  SelectionId.value = arr.map((o) => o.id)
}
const emit = defineEmits(['submitChoose'])
const submit = () => {
  dialogVisible.value = false
  emit('submitChoose', SelectionId.value)
}
</script>
<template>
  <el-dialog v-model="dialogVisible" width="75%">
    <el-table
      ref="multipleTableRef"
      :data="GoodsList"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="商品" width="300">
        <template #default="{ row }">
          <div style="display: flex">
            <div class="left" style="margin-right: 10px">
              <el-image
                style="width: 70px; height: 70px"
                :src="row.cover"
                fit="cover"
              />
            </div>
            <div class="right">
              <span style="font-size: 18px">{{ row.title }}</span>
              <div>
                <span style="color: red">{{ row.min_price }} &nbsp;</span>
                <span>|&nbsp; {{ row.min_oprice }}</span>
              </div>
              <p style="color: rgba(0, 0, 0, 0.2)">
                分类：{{ row.category ? row.category.name : '未分类' }}
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="总库存" align="center" width="80" />
      <el-table-column label="价格" align="center">
        <template #default="{ row }">
          <div>
            <span style="color: red">￥{{ row.min_price }}&nbsp;</span>
            <span>|&nbsp;{{ row.min_oprice }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
