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
