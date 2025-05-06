import request from '@/utils/request'
export const getHomeDataAPI = () => {
  return request({
    url: '/admin/statistics1'
  })
}
