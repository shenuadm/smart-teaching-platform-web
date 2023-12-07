import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: sessionStorage.getItem('username'),
    rolename: sessionStorage.getItem('rolename'),
    roleUrl: [],
    isLoading: false,
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
  },
  actions: {},
  modules: {},
});
