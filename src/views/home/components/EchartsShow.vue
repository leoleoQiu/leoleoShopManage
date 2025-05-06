<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
const currentTag = ref('week')
const checkTag = [
  {
    title: '近一月',
    value: 'month'
  },
  {
    title: '近一周',
    value: 'week'
  },
  {
    title: '今日',
    value: 'hour'
  }
]
const ChooseHandle = (e) => {
  currentTag.value = e
  getEchartMsg()
}
//图表
import * as echarts from 'echarts'
//要放在onMounted，因为获取dom元素需要渲染出来才行
//一定给获取渲染的盒子设置宽高
import { getEchartsData } from '@/api/home'
let myChart
onMounted(async () => {
  let chartDom = document.getElementById('echart-main')
  if (chartDom) {
    myChart = echarts.init(chartDom)
    getEchartMsg()
  }
})
const getEchartMsg = async () => {
  let option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }
    ]
  }
  myChart.showLoading()
  try {
    const res = await getEchartsData(currentTag.value)
    option.xAxis.data = res.data.x
    option.series[0].data = res.data.y
    myChart.setOption(option)
  } finally {
    myChart.hideLoading()
  }
}
onBeforeUnmount(() => {
  myChart.dispose()
})

//检测大小变化调用resize
import { useResizeObserver } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')

useResizeObserver(el, () => {
  if (myChart) {
    myChart.resize()
  }
})
</script>
<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between">
          <span>订单统计</span>
          <el-check-tag
            :checked="item.value === currentTag"
            v-for="item in checkTag"
            :key="item.value"
            @click="ChooseHandle(item.value)"
          >
            {{ item.title }}
          </el-check-tag>
        </div>
      </template>
      <div id="echart-main" style="width: 100%; height: 300px" ref="el"></div>
    </el-card>
  </div>
</template>
