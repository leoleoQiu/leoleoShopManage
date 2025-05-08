<script setup></script>
<template>
  <router-view></router-view>
</template>
<style>
#nprogress .bar {
  background-color: pink !important;
  height: 3px !important;
}
::-webkit-scrollbar {
  width: 4px; /* 垂直滚动条宽度 */
  height: 6px; /* 水平滚动条高度 */
}
::-webkit-scrollbar-corner {
  display: block;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
  /* background: transparent; */
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2); /* 滚动条滑块颜色 */
  border-radius: 4px;
}
::-webkit-scrollbar-track,
::-webkit-scrollbar-thumb {
  /* border-right-color: transparent; */
  border-left-color: transparent;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
