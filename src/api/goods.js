import request from '@/utils/request'
export const getGoodsAPI = (page, data) => {
  return request({
    url: '/admin/goods/' + page,
    params: data
  })
}
export const changeMangerStatusAPI = (id, status) => {
  return request({
    url: '/admin/manager/' + id + '/update_status',
    method: 'post',
    data: {
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
