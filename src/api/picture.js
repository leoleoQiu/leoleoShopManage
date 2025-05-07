import request from '@/utils/request'
export const getPictureAPI = (page) => {
  return request({
    url: '/admin/image_class/' + page,
    params: {
      limit: 10
    }
  })
}
