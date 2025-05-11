import request from '@/utils/request'
export const getRuleListAPI = () => {
  return request({
    url: '/admin/rule/1'
  })
}

export const addRuleListAPI = (data) => {
  return request({
    url: '/admin/rule',
    method: 'post',
    data
  })
}

export const editRuleListAPI = (id, data) => {
  return request({
    url: '/admin/rule/' + id,
    method: 'post',
    data
  })
}
