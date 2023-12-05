import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: sessionStorage.getItem('username'),
    roleId: localStorage.getItem('roleId'),
    roleUrl: [],
    isLoading: true,
  },
  getters: {},
  mutations: {
    getUsername(state) {
      const username = sessionStorage.getItem('username');
      state.username = username;
    },
    updateUsername(state, newusername) {
      state.username = newusername;
    },
    updateRoleId(state, newRoleId) {
      state.roleId = newRoleId;
    },
    setRoleUrl(state, newData) {
      state.roleUrl = newData;
    },
    setLoading(state, value) {
      state.isLoading = value;
    },
  },
  actions: {},
  modules: {},
});
