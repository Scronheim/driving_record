import Vue from 'vue'
import Vuex from 'vuex'
import schoolModule from '@/store/modules/school'
import eventModule from '@/store/modules/event'
import userModule from '@/store/modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiUrl: 'http://89.223.127.100:3000/api',
  },
  mutations: {},
  actions: {},
  modules: {
    schools: schoolModule,
    events: eventModule,
    users: userModule,
  }
})
