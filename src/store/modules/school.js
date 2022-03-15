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
      const {data} = await axios.get(`${rootState.apiUrl}/schools`)
      commit('setSchools', data.data)
    },
    async getSchoolGroups({commit, rootState}) {
      const {data} = await axios.get(`${rootState.apiUrl}/school_groups`)
      commit('setSchoolGroups', data.data)
    },
    async addNewSchool({rootState, dispatch}, payload) {
      await axios.post(`${rootState.apiUrl}/schools`, payload)
      dispatch('getSchools')
    },
    async updateSchool({rootState, dispatch}, payload) {
      await axios.patch(`${rootState.apiUrl}/schools`, payload)
      dispatch('getSchools')
    },
  },
  getters: {
    schools: state => state.schools,
    schoolGroups: state => state.schoolGroups,
  }
}

export default schoolModule
