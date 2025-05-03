import request from '@/utils/request'
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/admin/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}
export const getAdminMenuAPI = () => {
  return request({
    url: '/admin/getinfo',
    method: 'post'
  })
}
export const layoutAPI = () => {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}
