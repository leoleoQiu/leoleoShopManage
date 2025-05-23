import request from '@/utils/request'
export const getCommentAPI = (page, data) => {
  return request({
    url: '/admin/goods_comment/' + page,
    params: {
      title: data
    }
  })
}

export const updateStatusCommentAPI = (id, status) => {
  return request({
    url: '/admin/goods_comment/' + id + '/update_status',
    method: 'post',
    data: {
      status
    }
  })
}

export const reviewCommentAPI = (id, data) => {
  return request({
    url: '/admin/goods_comment/review/' + id,
    method: 'post',
    data
  })
}
