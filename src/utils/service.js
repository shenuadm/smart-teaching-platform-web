import axios from 'axios';
import { Message } from 'element-ui';
import store from '@/store';

// 配置基本URL
const service = axios.create({
  baseURL: window.location.origin + '/api',
  // timeout: 10000,
});
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 判断是否该请求地址是否有缓存,有则拦截请求
    if (store.state.apiMap.has(config.url)) return Promise.reject({ requestCacheError: '请勿重复点击' });
    // 请求地址加入缓存
    store.state.apiMap.set(
      config.url,
      setTimeout(() => {
        store.state.apiMap.delete(config.url);
      }, 500),
    );
    // console.log(config.url);
    // 开启加载动画
    store.commit('setLoading', true);
    // 可在此处对请求进行处理，例如添加请求头、设置认证信息等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 可在此处对响应进行处理，例如处理错误码、格式化数据等
    // 响应成功返回数据
    if (response.data.code === 0) {
      store.commit('setLoading', false);
      return response.data;
    } else {
      // 导入用户信息错误，一直显示错误信息
      if (response.data.code === 'user_excel_import_fail') {
        Message.error({
          showClose: true,
          duration: 0,
          message: response.data.msg,
        });
      } else {
        Message.error(response.data.msg);
      }
      // 不成功弹出提示消息
      // 响应状态码为not——login时表示未登录，跳转登录页
      if (response.data.code === 'not_login') {
        sessionStorage.clear();
        localStorage.clear();
        store.commit('setLoading', false);
        setTimeout(function () {
          window.location.href = '/';
        }, 2000);
      }
      store.commit('setLoading', false);
      return Promise.reject(response.data);
    }
  },
  (error) => {
    store.commit('setLoading', false);
    console.log(error, 'error');
    if (error.requestCacheError) {
      // Message.error(error.requestCacheError);
    } else {
      Message.error('服务器已经关闭，请稍后在连接！');
    }
    return Promise.reject(error);
  },
);

const http = {
  get(url, params = {}) {
    return service({
      url,
      params,
      method: 'get',
      headers: {
        satoken: localStorage.getItem('satoken'),
      },
    });
  },
  post(url, data = {}) {
    return service({
      url,
      data,
      method: 'post',
      headers: {
        satoken: localStorage.getItem('satoken'),
      },
    });
  },
  delete(url, params = {}) {
    return service({
      url,
      params,
      method: 'delete',
    });
  },
  put(url, data = {}) {
    return service({
      url,
      data,
      method: 'put',
      headers: {
        satoken: localStorage.getItem('satoken'),
      },
    });
  },
  formDate(url, data = {}) {
    return service({
      url,
      method: 'post',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
        satoken: localStorage.getItem('satoken'),
      },
    });
  },
};

export default http;
