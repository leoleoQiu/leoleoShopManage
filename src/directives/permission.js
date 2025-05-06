import { useUserStore } from '@/stores/index'
const hasPermission = (value, el) => {
  if (!(value instanceof Array)) {
    //不是数组抛出throw
    throw new Error('请输入一个数组')
  }
  const userStore = useUserStore()
  //判断用户的列表中是否有这个接口
  const hasfind = userStore.userMenu.ruleNames.includes(value.join())
  if (!hasfind) {
    if (el.parentNode) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
export const AddPermission = {
  install(app) {
    app.directive('permission', {
      mounted(el, binding) {
        hasPermission(binding.value, el)
      }
    })
  }
}
