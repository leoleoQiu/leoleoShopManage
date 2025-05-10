import request from '@/utils/request'
export const getManagerAPI = (page, limit = 10, keyword) => {
  return request({
    url: '/admin/manager/' + page,
    params: {
      limit,
      keyword
    }
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

export const addManagerAPI = (data) => {
  return request({
    url: '/admin/manager',
    method: 'post',
    data
  })
}

export const deleteManagerAPI = (id) => {
  return request({
    url: '/admin/manager/' + id + '/delete',
    method: 'post'
  })
}

export const editManagerAPI = (id, data) => {
  return request({
    url: '/admin/manager/' + id,
    method: 'post',
    data: data
  })
}
