import { ref } from 'vue'
import { useRoute, onBeforeRouteUpdate, useRouter } from 'vue-router'
import { usePageStore } from '@/stores'
export const Tabfunction = () => {
  const pageStore = usePageStore()
  const route = useRoute()
  const router = useRouter()
  const activeTag = ref(route.path)
  const TabList = ref(pageStore.TagList)

  onBeforeRouteUpdate((to) => {
    activeTag.value = to.fullPath
    addTab({
      title: to.meta.title,
      path: to.fullPath
    })
  })
  //如果没有的话就增加 可以借助onBeforeRouteUpdate
  const addTab = (tab) => {
    const haveTab = TabList.value.find((e) => e.path === tab.path)
    if (!haveTab) {
      TabList.value.push(tab)
      pageStore.updateTagList(TabList.value)
    }
  }
  //切换
  const changeTab = (e) => {
    router.push(e)
  }
  //移除
  const removeTab = (e) => {
    console.log(e)
    if (activeTag.value === e) {
      const nowindex = TabList.value.findIndex((item) => item.path === e)
      TabList.value = TabList.value.filter((item) => item.path !== e)
      router.push(TabList.value[nowindex - 1])
    } else {
      TabList.value = TabList.value.filter((item) => item.path !== e)
    }
    pageStore.updateTagList(TabList.value)
  }
  //下拉菜单
  const handleClose = (e) => {
    if (e === 'all') {
      TabList.value = TabList.value.filter((item) => item.path === '/')
      router.push('/')
    } else {
      TabList.value = TabList.value.filter(
        (item) => item.path === '/' || item.path === activeTag.value
      )
    }
  }
  return {
    TabList,
    activeTag,
    changeTab,
    removeTab,
    handleClose
  }
}
