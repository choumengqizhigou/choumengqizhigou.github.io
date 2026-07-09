import DefaultTheme from 'vitepress/theme'
import './style.css'
import Layout from './Layout.vue'

// 继承 VitePress 默认主题，仅替换 Layout 以挂载自定义页脚。
export default {
    extends: DefaultTheme,
    Layout
}
