import request from '@/utils/request'
export const getCategoryAPI = () => {
  return request({
    url: '/admin/category'
  })
}
