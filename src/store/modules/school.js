import axios from 'axios'

const schoolModule = {
  state: () => ({
    schools: [],
    schoolGroups: [],
  }),
  mutations: {
    setSchools(state, schools) {
      state.schools = schools
    },
    setSchoolGroups(state, payload) {
      state.schoolGroups = payload
    },
  },
  actions: {
    async getSchools({commit, rootState}) {
      const {data} = await axios.get(`${rootState.apiUrl}/api/schools`)
      commit('setSchools', data.data)
    },
    async getGroupsBySchoolId({commit, rootState}, id) {
      const {data} = await axios.get(`${rootState.apiUrl}/api/schools/${id}`)
      commit('setSchoolGroups', data.data)
    },
  },
  getters: {
    schools: state => state.schools,
    schoolGroups: state => state.schoolGroups,
  }
}

export default schoolModule
