import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import VueAxios from 'vue-axios';
import ElementUI from 'element-ui';
import { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 解决使用dialog弹出，页面垂直滚动条消失
ElementUI.Dialog.props.lockScroll.default = false;
//导入自定义element-UI主题
// import "./style/theme/index.css"
// 导入公共样式
import './style/common.css';
// 导入富文本编辑器
import Editor from '@/components/editor.vue';
import Aside from '@/components/aside.vue';
import { loading } from '@/utils/loading';
Vue.component('Editor', Editor);
Vue.component('AsideTem', Aside);
Vue.use(VueAxios, axios);
Vue.use(ElementUI);
Vue.mixin(loading);
//路由拦截
router.beforeEach((to, from, next) => {
  console.log(to);
  let isLogin = window.localStorage.getItem('satoken');
  if (isLogin) {
    next();
  } else {
    if (to.path === '/') {
      next();
    } else {
      Message('没有访问权限或登陆已过期，请重新登陆');
      next('/');
    }
  }
});
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
