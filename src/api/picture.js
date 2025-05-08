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
