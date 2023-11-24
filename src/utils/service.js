import axios from 'axios';
import { Message } from 'element-ui';

// 配置基本URL
const service = axios.create({
  baseURL: window.location.origin + '/api',
});
// 请求拦截器
service.interceptors.request.use(
  (config) => {
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
    if (response.data.code == 0) {
      return response.data;
    } else {
      Message.error(response.data.message);
      if (response.data.code == 'not_login') {
        this.$route.push('/');
      }
    }
  },
  (error) => {
    Message.error('服务异常');
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
