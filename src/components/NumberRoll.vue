<script setup>
import { reactive, watch } from 'vue'
import gsap from 'gsap'
const props = defineProps({
  value: {
    type: Number
  }
})
const d = reactive({
  num: 0
})
const animate = () => {
  gsap.to(d, {
    duration: 0.5,
    num: props.value
  })
}
animate()
watch(
  () => props.value,
  () => animate()
)
</script>
<template>{{ d.num.toFixed(0) }}</template>
