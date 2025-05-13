import request from '@/utils/request'
export const getCouponListAPI = (page = 1) => {
  return request({
    url: '/admin/coupon/' + page
  })
}

export const addCouponAPI = (data) => {
  return request({
    url: '/admin/coupon',
    method: 'post',
    data
  })
}

export const deleteCouponAPI = (id) => {
  return request({
    url: '/admin/coupon/' + id + '/delete',
    method: 'post'
  })
}

export const editCouponAPI = (id, data) => {
  return request({
    url: '/admin/coupon/' + id,
    method: 'post',
    data
  })
}

export const changeCouponStatusAPI = (id, status) => {
  return request({
    url: '/admin/Coupon/' + id + '/update_status',
    method: 'post',
    data: {
      status
    }
  })
}
