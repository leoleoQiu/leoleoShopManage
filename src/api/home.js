import request from '@/utils/request'
export const getHomeDataAPI = () => {
  return request({
    url: '/admin/statistics1'
  })
}

export const getEchartsData = (type) => {
  return request({
    url: 'admin/statistics3',
    params: {
      type
    }
  })
}

export const getShopDataAPI = () => {
  return request({
    url: 'admin/statistics2'
  })
}
