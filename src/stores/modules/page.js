import { defineStore } from 'pinia'
import { ref } from 'vue'
export const usePageStore = defineStore(
  'page-store',
  () => {
    const TagList = ref([
      {
        path: '/',
        title: '后台首页'
      }
    ])
    const updateTagList = (list) => {
      TagList.value = list
    }
    return { TagList, updateTagList }
  },
  {
    persist: true
  }
)
