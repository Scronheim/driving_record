import Vue from 'vue'
import Vuex from 'vuex'
import studentModule from '@/store/modules/student'
import instructorModule from '@/store/modules/instructor'
import schoolModule from '@/store/modules/school'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiUrl: 'http://89.223.127.100:3000',
  },
  mutations: {},
  actions: {},
  modules: {
    student: studentModule,
    instructors: instructorModule,
    schools: schoolModule,
  }
})
