import { ref } from 'vue'
import {
  addSkusGoodsAPI,
  exitSkusGoodsAPI,
  deleteSkusGoodsAPI
} from '@/api/goods'
export const goodsId = ref(0)
export const SkusLoading = ref(false)
export const skusCardList = ref([])
//初始化表格选项
export const initSkusCard = (value) => {
  skusCardList.value = value.goodsSkusCard.map((item) => {
    item.text = item.name
    item.loading = item.false
    item.goodsSkusCardValue.map((o) => {
      o.text = o.value
      return o
    })
    return item
  })
}

export const addSkusCard = async () => {
  const res = await addSkusGoodsAPI({
    goods_id: goodsId.value,
    name: '规格名称',
    order: 50,
    type: 0
  })
  skusCardList.value.push({
    ...res.data,
    text: res.data.name,
    loading: false,
    goodsSkusCardValue: []
  })
}

export const exitSkusGoods = async (item) => {
  try {
    item.loading = true
    await exitSkusGoodsAPI(item.id, {
      goods_id: item.goods_id,
      name: item.text,
      order: item.order,
      type: item.type
    })
    item.name = item.text
  } catch {
    item.text = item.name
  } finally {
    item.loading = false
  }
}

export const deleteSkusGoods = async (item) => {
  SkusLoading.value = true
  await deleteSkusGoodsAPI(item.id)
  ElMessage.success('成功删除')
  skusCardList.value = skusCardList.value.filter((o) => item.id !== o.id)
  SkusLoading.value = false
}

export const sortSkusGoods = async (action, index) => {
  if (action === 'up') {
    skusCardList.value[index] = skusCardList.value.splice(
      index - 1,
      1,
      skusCardList.value[index]
    )[0]
  } else {
    skusCardList.value[index] = skusCardList.value.splice(
      index + 1,
      1,
      skusCardList.value[index]
    )[0]
  }
}
