<template>
  <editor v-model="content" tag-name="div" :init="init" />
  <Imagechoose ref="imageChoose" :preview="false"></Imagechoose>
</template>
<script setup>
import Imagechoose from '@/views/Manager/components/ImageChoose.vue'
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import { ref, watch } from 'vue'
import 'tinymce/themes/silver/theme' // 引用主题文件
import 'tinymce/icons/default' // 引用图标文件
import 'tinymce/models/dom'
// tinymce插件可按自己的需要进行导入
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/charmap' // 特殊字符
import 'tinymce/plugins/code' // 查看源码
import 'tinymce/plugins/codesample' // 插入代码
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/fullscreen' //全屏
import 'tinymce/plugins/help'
import 'tinymce/plugins/image' // 插入上传图片插件
import 'tinymce/plugins/importcss' //图片工具
import 'tinymce/plugins/insertdatetime' //时间插入
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists' // 列表插件
import 'tinymce/plugins/media' // 插入视频插件
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/pagebreak' //分页
import 'tinymce/plugins/preview' // 预览
import 'tinymce/plugins/quickbars'
import 'tinymce/plugins/save' // 保存
import 'tinymce/plugins/searchreplace' //查询替换
import 'tinymce/plugins/table' // 插入表格插件
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/wordcount' // 字数统计插件
// v-model
const props = defineProps({
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])
const imageChoose = ref(null)
// 配置
const init = {
  language: 'zh_CN',
  language_url: '/tinymce/langs/zh_CN.js', // 中文语言包路径
  skin_url: '/tinymce/skins/ui/oxide', // 编辑器皮肤样式
  content_css: '/tinymce/skins/content/default/content.min.css',
  menubar: false, // 隐藏菜单栏
  autoresize_bottom_margin: 50,
  max_height: 500,
  min_height: 450,
  // height: 320,
  toolbar_mode: 'none',
  plugins: 'advlist lists link image table code',
  toolbar:
    'formats undo redo fontsizeselect fontselect ltr rtl searchreplace media imageUpload |outdent indent aligncenter alignleft alignright alignjustify lineheight underline quicklink h2 h3 blockquote numlist bullist table removeformat forecolor backcolor bold italic strikethrough hr link preview fullscreen ',
  content_style: 'p {margin: 5px 0; font-size: 14px}',
  fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
  font_formats:
    ' 微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方 =PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑 体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
  branding: false,
  elementpath: false,
  resize: false, // 禁止改变大小
  statusbar: false, // 隐藏底部状态栏
  license_key: 'gpl', // 添加开源许可证
  base_url: '/tinymce', // 添加基础URL配置
  relative_urls: false, // 添加此配置，使用绝对路径
  remove_script_host: false, // 添加此配置，保留完整URL
  document_base_url: '/', // 添加此配置，指定基础URL
  setup: (editor) => {
    editor.ui.registry.addButton('imageUpload', {
      tooltip: '插入图片',
      icon: 'image',
      onAction() {
        imageChoose.value.Open((data) => {
          editor.insertContent(`<img src="${data}" style="width:100%" /> `)
        })
      }
    })
  }
}
tinymce.init // 初始化
const content = ref(props.modelValue)
watch(props, (newVal) => (content.value = newVal.modelValue))
watch(content, (newVal) => emit('update:modelValue', newVal))
</script>
