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
