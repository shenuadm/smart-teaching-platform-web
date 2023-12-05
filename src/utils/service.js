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
    if (response.data.code == 0) {
      store.commit('setLoading', false);
      return response.data;
    } else {
      // 不成功弹出提示消息
      Message.error(response.data.msg);
      // 响应状态码为not——login时表示未登录，跳转登录页
      if (response.data.code == 'not_login') {
        sessionStorage.clear();
        localStorage.clear();
        store.commit('setLoading', false);
        setTimeout( function (){window.location.href = '/'},2000)
      }
      store.commit('setLoading', false);
      return Promise.reject(response.data);
    }
  },
  (error) => {
    Message.error('服务器已经关闭，请稍后在连接！');
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
