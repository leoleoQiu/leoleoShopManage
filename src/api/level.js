import request from '@/utils/request'
export const getUserListAPI = (page = 1, data) => {
  return request({
    url: '/admin/user_level/' + page,
    params: data
  })
}

export const addUserAPI = (data) => {
  return request({
    url: '/admin/user_level',
    method: 'post',
    data
  })
}

export const deleteUserAPI = (id) => {
  return request({
    url: '/admin/user_level/' + id + '/delete',
    method: 'post'
  })
}

export const editUserAPI = (id, data) => {
  return request({
    url: '/admin/user_level/' + id,
    method: 'post',
    data
  })
}

export const changeUserStatusAPI = (id, status) => {
  return request({
    url: '/admin/user_level/' + id + '/update_status',
    method: 'post',
    data: {
      status
    }
  })
}
