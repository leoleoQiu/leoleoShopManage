import axios from 'axios'
import { ElMessage } from 'element-plus'
const instance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    ElMessage.error({
      message: error.response.data.msg || '请求失败'
    })
    return Promise.reject(error.response.data.msg)
  }
)
export default instance
