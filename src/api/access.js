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

export const deleteRuleListAPI = (id) => {
  return request({
    url: '/admin/rule/' + id + '/delete',
    method: 'post'
  })
}

export const changeRuleStatusAPI = (id, status) => {
  return request({
    url: '/admin/rule/' + id + '/update_status',
    method: 'post',
    data: { status }
  })
}
