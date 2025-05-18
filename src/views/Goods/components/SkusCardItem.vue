<script setup>
defineProps({
  skusCardItemId: [Number, String],
  skusCardItemValue: {
    type: [Array, String],
    default: () => []
  }
})
</script>
<template>
  <div v-for="item in skusCardItemValue" :key="item.id">{{ item.text }}</div>
</template>
