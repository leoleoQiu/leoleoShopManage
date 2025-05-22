import request from '@/utils/request'
export const getCategoryAPI = () => {
  return request({
    url: '/admin/category'
  })
}

export const addCategoryAPI = (data) => {
  return request({
    url: '/admin/category',
    method: 'post',
    data: data
  })
}

export const editCategoryAPI = (id, data) => {
  return request({
    url: '/admin/category' + id,
    method: 'post',
    data: data
  })
}

export const updateStatusCategoryAPI = (id, status) => {
  return request({
    url: '/admin/category/' + id + '/update_status',
    method: 'post',
    data: {
      status
    }
  })
}

export const deleteCategoryAPI = (id) => {
  return request({
    url: '/admin/category/' + id + '/delete',
    method: 'post'
  })
}

export const recommemdCategoryAPI = (category_id) => {
  return request({
    url: '/admin/app_category_item/list',
    params: {
      category_id
    }
  })
}

export const deleterecommemdCategoryAPI = (id) => {
  return request({
    url: '/admin/app_category_item/' + id + '/delete',
    method: 'post'
  })
}

export const connectCategoryAPI = (data) => {
  return request({
    url: '/admin/app_category_item',
    method: 'post',
    data
  })
}
