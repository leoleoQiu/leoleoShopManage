import request from '@/utils/request'
export const getSkusListAPI = (page = 1) => {
  return request({
    url: '/admin/skus/' + page
  })
}

export const addSkusAPI = ({ name, status, default: isdefault, order }) => {
  return request({
    url: '/admin/skus',
    method: 'post',
    data: {
      name,
      status,
      order,
      default: isdefault
    }
  })
}

export const deleteSkusAPI = (ids) => {
  return request({
    url: '/admin/skus/delete_all',
    method: 'post',
    data: {
      ids
    }
  })
}

export const editSkusAPI = (id, data) => {
  return request({
    url: '/admin/skus/' + id,
    method: 'post',
    data
  })
}

export const changeSkusStatusAPI = (id, status) => {
  return request({
    url: '/admin/skus/' + id + '/update_status',
    method: 'post',
    data: {
      status
    }
  })
}
