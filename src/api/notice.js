import request from '@/utils/request'
export const getNoticeListAPI = (page = 1) => {
  return request({
    url: '/admin/notice/' + page
  })
}
