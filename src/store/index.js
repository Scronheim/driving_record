import Vue from 'vue'
import Vuex from 'vuex'
import userModule from '@/store/modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {
  },
  modules: {
    user: userModule
  }
})
