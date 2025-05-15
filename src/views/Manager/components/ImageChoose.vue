<script setup>
import { ref, nextTick } from 'vue'
const DialogVisible = ref(false)
const callBackFun = ref(null)
const Open = (callBack = null) => {
  callBackFun.value = callBack
  DialogVisible.value = true
}
//Picture中的函数
import AsidePage from '@/views/Picture/components/AsidePage.vue'
import ImagePage from '@/views/Picture/components/ImagePage.vue'
const Aside = ref(null)
const addPicture = () => {
  Aside.value.onAdd()
}
// 右侧图片列表获取
const ImageModuleRef = ref(null)
const gainPictureList = (id) => {
  ImageModuleRef.value.getImageData(id)
}
const UploadImg = () => {
  ImageModuleRef.value.UploadOpen()
}
//
const modelValue = defineModel()
let ImgUrl = ''
const props = defineProps({
  limit: {
    type: Number,
    default: 1
  },
  preview: {
    type: Boolean,
    default: true
  }
})
const avaterChoose = (url) => {
  ImgUrl = url
}
//处理头像选择
const handleConfirm = async () => {
  if (ImgUrl) {
    if (props.limit === 1) {
      //是否是富文本
      if (!props.preview && typeof callBackFun.value === 'function') {
        callBackFun.value(ImgUrl)
      } else {
        modelValue.value = ImgUrl
      }
    } else {
      const nowValue = [...modelValue.value]
      for (let k of ImgUrl) {
        if (!nowValue.includes(k.url)) {
          nowValue.push(k.url)
        }
      }
      if (nowValue.length > props.limit) {
        return ElMessage.success(
          `最多还可以选择${props.limit - modelValue.value.length}张`
        )
      }
      // console.log('now', nowValue)
      modelValue.value = [...nowValue]
      await nextTick()
      // console.log(modelValue.value)
    }
    DialogVisible.value = false
  } else {
    ElMessage({
      message: '请选择图片',
      type: 'error'
    })
  }
}
//移除轮播图
const removeBanner = (url) => {
  modelValue.value = modelValue.value.filter((o) => o !== url)
}

defineExpose({
  Open
})
</script>
<template>
  <div v-if="preview" style="display: flex; flex-wrap: wrap">
    <div v-if="modelValue" style="display: flex; flex-wrap: wrap">
      <img
        v-if="typeof modelValue === 'string'"
        :src="modelValue"
        alt=""
        class="avater-choose"
        style="object-fit: cover; margin-right: 5px"
      />
      <template v-else>
        <div
          v-for="item in modelValue"
          :key="item"
          style="margin-bottom: 5px; position: relative"
        >
          <img
            :src="item"
            alt=""
            class="avater-choose image-body"
            style="object-fit: cover; margin-right: 5px; cursor: auto"
          />
          <div
            style="position: absolute; right: 3px; top: 0px; cursor: pointer"
            @click="removeBanner(item)"
          >
            <el-icon size="20"><CircleClose /></el-icon>
          </div>
        </div>
      </template>
      <div class="avater-choose" @click="Open">
        <el-icon size="25"><Plus /></el-icon>
      </div>
    </div>
    <div v-else class="avater-choose" @click="Open">
      <el-icon size="25"><Plus /></el-icon>
    </div>
  </div>

  <el-dialog
    v-model="DialogVisible"
    title="选择头像"
    center
    align-center
    width="75%"
  >
    <el-container class="image-body" :style="{ height: '70vh' }">
      <el-header class="image-header" style="border-bottom: 1px solid black">
        <el-button @click="addPicture" style="margin-left: 15px"
          >新增列表</el-button
        >
        <el-button @click="UploadImg">上传图片</el-button>
      </el-header>
      <el-container class="image-main">
        <AsidePage ref="Aside" @activeChange="gainPictureList"></AsidePage>
        <ImagePage
          ref="ImageModuleRef"
          @chooseImg="avaterChoose"
          isChoose
          :limit="props.limit"
        ></ImagePage>
      </el-container>
    </el-container>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="DialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.avater-choose {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 15vh;
  aspect-ratio: 1/1;
  background-color: rgb(212, 212, 216);
  cursor: pointer;
  color: white;
}
</style>
