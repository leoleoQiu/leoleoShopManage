import { ref } from 'vue'
import {
  addSkusGoodsAPI,
  exitSkusGoodsAPI,
  deleteSkusGoodsAPI,
  sortSkusGoodsAPI,
  addSkusGoodsItemAPI,
  updateSkusGoodsItemAPI,
  deleteSkusGoodsItemAPI,
  chooseAndSetSkusGoodsAPI
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
  const sortData = skusCardList.value.map((e, i) => {
    return {
      id: e.id,
      order: i + 1
    }
  })
  console.log(sortData)
  try {
    SkusLoading.value = true
    await sortSkusGoodsAPI(sortData)
  } finally {
    SkusLoading.value = false
  }
}
//添加属性值
export const addItemValue = async (value, item) => {
  try {
    SkusLoading.value = true
    const res = await addSkusGoodsItemAPI({
      goods_skus_card_id: item.id,
      name: item.name,
      order: 50,
      value: value
    })
    item.goodsSkusCardValue.push({ ...res.data, text: res.data.value })
  } finally {
    SkusLoading.value = false
  }
}

export const updateItemValue = async (value, tag) => {
  try {
    await updateSkusGoodsItemAPI(tag.id, {
      goods_skus_card_id: tag.goods_skus_card_id,
      name: tag.name,
      order: tag.order,
      value: value
    })
    tag.value = tag.text
  } catch {
    tag.text = tag.value
  }
}

export const deleteItemValue = async (tag, item) => {
  await deleteSkusGoodsItemAPI(tag.id)
  item.goodsSkusCardValue = item.goodsSkusCardValue.filter(
    (o) => tag.id !== o.id
  )
}

export const submitChoose = async (id, data) => {
  const item = skusCardList.value.find((o) => id === o.id)
  try {
    SkusLoading.value = true
    const res = await chooseAndSetSkusGoodsAPI(id, {
      name: data.name,
      value: data.checkList
    })
    item.name = res.data.goods_skus_card.name
    item.text = res.data.goods_skus_card.name
    item.goodsSkusCardValue = res.data.goods_skus_card_value.map((o) => {
      o.text = o.value
      return o
    })
  } finally {
    SkusLoading.value = false
  }
}
