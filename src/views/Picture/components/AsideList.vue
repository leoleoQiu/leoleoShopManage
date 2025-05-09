<script setup>
const props = defineProps({
  title: String,
  active: Boolean
})
</script>
<template>
  <div class="aside-list" :class="{ active: active }">
    <div class="text">{{ props.title }}</div>
    <div class="button">
      <el-button
        type="primary"
        text
        style="padding-left: 0; padding-right: 0"
        @click.stop="$emit('edit')"
      >
        <el-icon style="font-size: 20px"><Edit /></el-icon>
      </el-button>
      <span @click.stop="() => {}">
        <el-popconfirm
          width="220"
          icon-color="#626AEF"
          title="你确认要删除吗?"
          @confirm="$emit('delete')"
        >
          <template #reference>
            <el-button
              type="primary"
              text
              style="padding-left: 0; padding-right: 0"
            >
              <el-icon style="font-size: 20px"><Close /></el-icon>
            </el-button>
          </template>
          <template #actions="{ confirm, cancel }">
            <el-button size="small" @click="cancel">No!</el-button>
            <el-button type="danger" size="small" @click="confirm">
              Yes?
            </el-button>
          </template>
        </el-popconfirm>
      </span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.active {
  background-color: rgb(198, 226, 255);
}
.aside-list {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
  &:hover {
    background-color: rgb(198, 226, 255);
  }
  .text {
    font-weight: 300;
    margin: 10px;
    flex: 1;
    text-wrap: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
