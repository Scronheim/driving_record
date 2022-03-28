import Vue from 'vue'
import Vuex from 'vuex'
import schoolModule from '@/store/modules/school'
import eventModule from '@/store/modules/event'
import userModule from '@/store/modules/user'
import courseModule from '@/store/modules/course'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiUrl: 'http://89.223.127.100:3000/api',
  },
  mutations: {},
  actions: {
    async getAllData({dispatch}) {
      await dispatch('aboutMe')
      await dispatch('getGroups')
      await dispatch('getEvents')
      await dispatch('getEventTypes')
      await dispatch('getEventStatuses')
      await dispatch('getUsers')
      await dispatch('getPaymentTypes')
      await dispatch('getRoles')
    }
  },
  modules: {
    schools: schoolModule,
    events: eventModule,
    users: userModule,
    courses: courseModule,
  }
})
