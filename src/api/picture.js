import request from '@/utils/request'
export const getPictureAPI = (page) => {
  return request({
    url: '/admin/image_class/' + page,
    params: {
      limit: 10
    }
  })
}

export const AddPictureAPI = ({ name, order }) => {
  return request({
    url: '/admin/image_class',
    method: 'post',
    data: {
      name,
      order
    }
  })
}

export const EditPictureAPI = (id, name, order) => {
  return request({
    url: '/admin/image_class/' + id,
    method: 'post',
    data: {
      name,
      order
    }
  })
}

export const DeletePictureAPI = (id) => {
  return request({
    url: '/admin/image_class/' + id + '/delete',
    method: 'post'
  })
}
// 获取图片
export const getClassPictureAPI = (id, page) => {
  return request({
    url: '/admin/image_class/' + id + '/image/' + page
  })
}

//重命名图片
export const EditClassPictureAPI = (id, name) => {
  return request({
    url: '/admin/image/' + id,
    method: 'post',
    data: {
      name
    }
  })
}

//删除图片
export const DeleteClassPictureAPI = (ids) => {
  return request({
    url: '/admin/image/delete_all',
    method: 'post',
    data: {
      ids
    }
  })
}
