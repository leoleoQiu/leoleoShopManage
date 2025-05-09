import request from '@/utils/request'
export const getNoticeListAPI = (page = 1) => {
  return request({
    url: '/admin/notice/' + page
  })
}

export const addNoticeAPI = ({ title, content }) => {
  return request({
    url: '/admin/notice',
    method: 'post',
    data: {
      title,
      content
    }
  })
}

export const deleteNoticeAPI = (id) => {
  return request({
    url: '/admin/notice/' + id + '/delete',
    method: 'post'
  })
}

export const editNoticeAPI = (id, title, content) => {
  return request({
    url: '/admin/notice/' + id,
    method: 'post',
    data: {
      title,
      content
    }
  })
}
