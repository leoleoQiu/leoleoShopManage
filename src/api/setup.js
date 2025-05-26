import request from '@/utils/request'
export const getConfigAPI = () => {
  return request({
    url: '/admin/sysconfig'
  })
}

export const exitConfigAPI = (data) => {
  return request({
    url: '/admin/sysconfig',
    method: 'post',
    data
  })
}
