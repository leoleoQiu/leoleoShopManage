import { ref, computed } from 'vue'
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
export const skusGoodsList = ref([])
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
  skusGoodsList.value = value.goodsSkus
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
  changeTableValue()
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
    changeTableValue()
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
    changeTableValue()
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
    changeTableValue()
  } finally {
    SkusLoading.value = false
  }
}
//更新属性值
export const updateItemValue = async (value, tag) => {
  try {
    await updateSkusGoodsItemAPI(tag.id, {
      goods_skus_card_id: tag.goods_skus_card_id,
      name: tag.name,
      order: tag.order,
      value: value
    })
    tag.value = tag.text
    changeTableValue()
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
//更新规格以及属性
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
    changeTableValue()
  } finally {
    SkusLoading.value = false
  }
}

//初始化表格
export const initTableData = () => {
  const skusLables = computed(() =>
    skusCardList.value.filter((o) => o.goodsSkusCardValue.length > 0)
  )
  //表头
  const tableLables = computed(() => {
    let length = skusLables.value.length
    return [
      { name: '商品规格', colspan: length, rowspan: length > 0 ? 1 : 2 },
      { name: '销售价', width: '100', rowspan: 2 },
      { name: '市场价', width: '100', rowspan: 2 },
      { name: '成本价', width: '100', rowspan: 2 },
      { name: '库存', width: '100', rowspan: 2 },
      { name: '体积', width: '100', rowspan: 2 },
      { name: '重量', width: '100', rowspan: 2 },
      { name: '编码', width: '100', rowspan: 2 }
    ]
  })
  return {
    skusLables,
    tableLables
  }
}

// 笛卡尔积，保留原对象
function cartesianProduct(arr) {
  return arr.reduce(
    (a, b) => {
      return a.flatMap((d) => b.map((e) => d.concat([e])))
    },
    [[]]
  )
}

const changeTableValue = () => {
  const arr = cartesianProduct(
    skusCardList.value
      .filter(
        (item) => item.goodsSkusCardValue && item.goodsSkusCardValue.length > 0
      )
      .map((item) => item.goodsSkusCardValue)
  )
  skusGoodsList.value = arr.map((o) => {
    return {
      code: '',
      cprice: '0.00',
      image: '',
      oprice: '0.00',
      pprice: '0.00',
      goods_id: goodsId.value,
      skus: o,
      stock: 0,
      volume: 0,
      weight: 0
    }
  })
}
