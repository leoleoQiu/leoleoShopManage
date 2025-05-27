import request from '@/utils/request'
export const getStatisticsAPI = () => {
  return request({
    url: '/admin/agent/statistics'
  })
}

export const getUserAPI = (page, data) => {
  return request({
    url: '/admin/agent/' + page,
    params: data
  })
}

export const getSettingAPI = () => {
  return request({
    url: '/admin/distribution_setting/get'
  })
}

export const editSettingAPI = (data) => {
  return request({
    url: '/admin/distribution_setting/set',
    method: 'post',
    data
  })
}
