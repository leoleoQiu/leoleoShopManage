import request from '@/utils/request'
export const getOrderAPI = (page, data) => {
  return request({
    url: '/admin/order/' + page,
    params: data
  })
}

export const deleteLotOrderAPI = (ids) => {
  return request({
    url: '/admin/order/delete_all',
    method: 'post',
    data: {
      ids
    }
  })
}

export const sendOrderAPI = (id, data) => {
  return request({
    url: '/admin/order/' + id + '/ship',
    method: 'post',
    data
  })
}

export const refundOrderAPI = (id, data) => {
  return request({
    url: '/admin/order/' + id + '/handle_refund',
    method: 'post',
    data
  })
}

export const exportOrderAPI = (data) => {
  return request({
    url: '/admin/order/excelexport',
    method: 'post',
    data
  })
}

export const getCompanyAPI = () => {
  return request({
    url: '/admin/express_company/1'
  })
}

export const getDeliveryAPI = (id) => {
  return request({
    url: '/admin/order/' + id + '/get_ship_info'
  })
}
