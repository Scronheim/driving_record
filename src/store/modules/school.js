import axios from 'axios'

const schoolModule = {
  state: () => ({
    schools: [],
    groups: [],
  }),
  mutations: {
    setSchools(state, schools) {
      state.schools = schools
    },
    setGroups(state, groups) {
      state.groups = groups
    },
  },
  actions: {
    async getGroups({commit, rootState}) {
      const {data} = await axios.get(`${rootState.apiUrl}/groups`)
      commit('setGroups', data.data)
    },
    async getSchools({commit, rootState}) {
      const {data} = await axios.get(`${rootState.apiUrl}/schools`)
      commit('setSchools', data.data)
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
    groups: state => state.groups,
  }
}

export default schoolModule
