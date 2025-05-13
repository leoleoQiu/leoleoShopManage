<script setup>
import { nextTick, ref } from 'vue'

const props = defineProps({
  modelValue: String
})
const dynamicTags = ref(props.modelValue ? props.modelValue.split(',') : [])
const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref()

const handleClose = (tag) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value.input.focus()
  })
}

const emit = defineEmits(['update:modelValue'])
const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
    emit('update:modelValue', dynamicTags.value.join(','))
  }
  inputVisible.value = false
  inputValue.value = ''
}
</script>

<template>
  <div class="flex gap-2">
    <el-tag
      v-for="tag in dynamicTags"
      style="height: 30px; margin-right: 4px"
      :key="tag"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="InputRef"
      style="width: 30%"
      v-model="inputValue"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button
      v-else
      class="button-new-tag"
      size="small"
      @click="showInput"
      style="height: 30px"
    >
      + 新的规格
    </el-button>
  </div>
</template>
