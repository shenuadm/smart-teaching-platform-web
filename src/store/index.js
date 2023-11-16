import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: localStorage.getItem("username")
  },
  getters: {
  },
  mutations: {
    // 动态改变登录用户的登录状态
    updateUsername(state, newUsername) {
      state.username = newUsername
    }
  },
  actions: {
  },
  modules: {
  }
})
