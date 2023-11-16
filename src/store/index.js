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
    updateUsername(state, newusername) {
      state.username = newusername
    }
  },
  actions: {
  },
  modules: {
  }
})
