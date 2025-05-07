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
  width: 7px; /* 垂直滚动条宽度 */
  height: 2px; /* 水平滚动条高度 */
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  /* background: transparent; */
  border-radius: 4px;
  margin: 0;
}

::-webkit-scrollbar-thumb {
  background: #888; /* 滚动条滑块颜色 */
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555; /* 滑块悬停颜色 */
}
</style>
