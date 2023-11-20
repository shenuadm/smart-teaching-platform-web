import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 解决使用dialog弹出，页面垂直滚动条消失
ElementUI.Dialog.props.lockScroll.default = false;
//导入自定义element-UI主题
// import "./style/theme/index.css"
// 导入公共样式
import './style/common.css'
// 导入富文本编辑器
import Editor from '@/components/editor.vue'
Vue.component('Editor', Editor)
Vue.use(VueAxios, axios)
Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
