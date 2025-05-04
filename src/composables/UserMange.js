import { repasswordAPI } from '@/api/login'
import { ref } from 'vue'
export const repasswordFun = () => {
  const ruleForm = ref({
    username: '',
    password: '',
    repassword: ''
  })
  const forms = ref(null)
  const rules = ref({
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
    ],
    repassword: [
      { required: true, message: '请再次输入密码', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (value !== ruleForm.value.password) {
            callback(new Error('两次输入密码不一致'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  })
  const FormDrawer = ref()
  const repasswordHandle = async () => {
    try {
      await forms.value.validate()
      FormDrawer.value.handleLoading()
      await repasswordAPI(ruleForm.value)
      ElMessage({
        message: '修改成功',
        type: 'success'
      })
    } finally {
      FormDrawer.value.handleLoadingClose()
    }
  }
  return {
    ruleForm,
    forms,
    rules,
    repasswordHandle,
    FormDrawer
  }
}
