<script setup>
defineProps({
  skusCardItemId: [Number, String],
  skusCardItemValue: {
    type: [Array, String],
    default: () => []
  }
})
import { nextTick, ref } from 'vue'

const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref()
const emit = defineEmits(['addItemValue', 'updateItemValue', 'deleteItemValue'])

const handleClose = (tag) => {
  emit('deleteItemValue', tag)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value.input.focus()
  })
}
const handleInputConfirm = () => {
  if (inputValue.value) {
    emit('addItemValue', inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}
const handleInputChange = (e, tag) => {
  emit('updateItemValue', e, tag)
}
</script>
<template>
  <div class="flex gap-2">
    <el-tag
      v-for="tag in skusCardItemValue"
      :key="tag"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
      style="margin-right: 4px"
      effect="plain"
    >
      <el-input
        v-model="tag.text"
        style="margin-left: -10px; width: 100px"
        size="small"
        @change="handleInputChange($event, tag)"
      ></el-input>
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="w-20"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button v-else class="button-new-tag" size="small" @click="showInput">
      + New Tag
    </el-button>
  </div>
</template>
