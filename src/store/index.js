import Vue from 'vue';
import Vuex from 'vuex';
import { promptUnreadNoticeService } from '@/api/notice';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: sessionStorage.getItem('username'),
    rolename: sessionStorage.getItem('rolename'),
    roleUrl: [],
    isLoading: false, // 是否是加载状态
    unreadNotice: 0, // 未读通知数
    apiMap: new Map([]), // 请求缓存
  },
  getters: {
    isStudent(state) {
      return state.rolename === 'student';
    },
  },
  mutations: {
    getUsername(state) {
      const username = sessionStorage.getItem('username');
      state.username = username;
    },
    getRolename(state) {
      const rolename = sessionStorage.getItem('rolename');
      state.rolename = rolename;
    },
    updateUsername(state, newusername) {
      state.username = newusername;
    },
    setRoleUrl(state, newData) {
      state.roleUrl = newData;
    },
    setLoading(state, value) {
      state.isLoading = value;
    },
    setUnreadNotice(state, value) {
      state.unreadNotice = value;
    },
    setApiMap(state, value) {
      state.apiMap.set(
        value,
        setTimeout(() => {
          state.apiMap.delete(value);
        }, 1000),
      );
    },
  },
  actions: {
    // 获取未阅读的系统通知数
    async getUnreadNotice(context) {
      const { data } = await promptUnreadNoticeService();
      context.commit('setUnreadNotice', data);
    },
  },
  modules: {},
});
