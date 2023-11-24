import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // username: localStorage.getItem("username")
    username: sessionStorage.getItem("username"),
    roleId: localStorage.getItem("roleId")
  },
  getters: {
  },
  mutations: {
    updateUsername(state, newusername) {
      state.username = newusername
    },
    updateRoleId(state, newRoleId) {
      state.roleId = newRoleId
    }
  },
  actions: {
  },
  modules: {
  }
})
