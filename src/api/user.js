import request from '@/utils/request'
export const getUserAPI = (page = 1, data) => {
  return request({
    url: '/admin/user/' + page,
    params: data
  })
}

export const addUserAPI = (data) => {
  return request({
    url: '/admin/user',
    method: 'post',
    data
  })
}

export const deleteUserAPI = (id) => {
  return request({
    url: '/admin/user/' + id + '/delete',
    method: 'post'
  })
}

export const editUserAPI = (id, data) => {
  return request({
    url: '/admin/user/' + id,
    method: 'post',
    data
  })
}

export const changeUserStatusAPI = (id, status) => {
  return request({
    url: '/admin/user/' + id + '/update_status',
    method: 'post',
    data: {
      status
    }
  })
}
