import request from '@/utils/request'
export const getRoleListAPI = (page = 1) => {
  return request({
    url: '/admin/role/' + page
  })
}

export const addRoleAPI = ({ name, status, desc }) => {
  return request({
    url: '/admin/role',
    method: 'post',
    data: {
      name,
      status,
      desc
    }
  })
}

export const deleteRoleAPI = (id) => {
  return request({
    url: '/admin/role/' + id + '/delete',
    method: 'post'
  })
}

export const editRoleAPI = (id, data) => {
  return request({
    url: '/admin/role/' + id,
    method: 'post',
    data
  })
}

export const changeRoleStatusAPI = (id, status) => {
  return request({
    url: '/admin/role/' + id + '/update_status',
    method: 'post',
    data: {
      status
    }
  })
}

export const SetRoleRuleAPI = (id, ruleIds) => {
  return request({
    url: '/admin/role/set_rules',
    method: 'post',
    data: {
      id,
      rule_ids: ruleIds
    }
  })
}
