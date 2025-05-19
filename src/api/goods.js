import request from '@/utils/request'
export const getGoodsAPI = (page, data) => {
  return request({
    url: '/admin/goods/' + page,
    params: data
  })
}
export const changeGoodsStatusAPI = (ids, status) => {
  return request({
    url: '/admin/goods/changestatus',
    method: 'post',
    data: {
      ids,
      status
    }
  })
}

export const addGoodsAPI = (data) => {
  return request({
    url: '/admin/goods',
    method: 'post',
    data
  })
}

export const deleteLotGoodsAPI = (ids) => {
  return request({
    url: '/admin/goods/delete_all',
    method: 'post',
    data: {
      ids
    }
  })
}

export const editGoodsAPI = (id, data) => {
  return request({
    url: '/admin/goods/' + id,
    method: 'post',
    data: data
  })
}
//轮播图
export const readBannerAPI = (id) => {
  return request({
    url: '/admin/goods/read/' + id
  })
}

export const setBannerAPI = (id, banners) => {
  return request({
    url: '/admin/goods/banners/' + id,
    method: 'post',
    data: {
      banners
    }
  })
}

//商品规格
export const updateSkusGoodsAPI = (id, data) => {
  return request({
    url: '/admin/goods/updateskus/' + id,
    method: 'POST',
    data: data
  })
}

export const addSkusGoodsAPI = (data) => {
  return request({
    url: '/admin/goods_skus_card',
    method: 'post',
    data: data
  })
}

export const exitSkusGoodsAPI = (id, data) => {
  return request({
    url: '/admin/goods_skus_card/' + id,
    method: 'post',
    data: data
  })
}

export const deleteSkusGoodsAPI = (id) => {
  return request({
    url: '/admin/goods_skus_card/' + id + '/delete',
    method: 'post'
  })
}

export const sortSkusGoodsAPI = (data) => {
  return request({
    url: '/admin/goods_skus_card/sort',
    method: 'post',
    data: {
      sortdata: data
    }
  })
}

export const addSkusGoodsItemAPI = (data) => {
  return request({
    url: '/admin/goods_skus_card_value',
    method: 'post',
    data
  })
}

export const updateSkusGoodsItemAPI = (id, data) => {
  return request({
    url: '/admin/goods_skus_card_value/' + id,
    method: 'post',
    data
  })
}

export const deleteSkusGoodsItemAPI = (id) => {
  return request({
    url: '/admin/goods_skus_card_value/' + id + '/delete',
    method: 'post'
  })
}

export const chooseAndSetSkusGoodsAPI = (id, data) => {
  return request({
    url: '/admin/goods_skus_card/' + id + '/set',
    method: 'post',
    data
  })
}
