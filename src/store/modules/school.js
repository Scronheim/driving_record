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
    async addNewGroup({rootState, dispatch}, payload) {
      await axios.post(`${rootState.apiUrl}/groups`, payload)
      dispatch('getGroups')
    },
    async updateGroup({rootState, dispatch}, payload) {
      await axios.patch(`${rootState.apiUrl}/groups`, payload)
      dispatch('getGroups')
    },
    async getGroups({commit, rootState}) {
      const {data} = await axios.get(`${rootState.apiUrl}/groups`)
      commit('setGroups', data.data)
    },
    async getSchools({commit, rootState}) {
      const {data} = await axios.get(`${rootState.apiUrl}/schools`)
      commit('setSchools', data.data)
    },
    async removeSchool({rootState, dispatch}, payload) {
      await axios.delete(`${rootState.apiUrl}/schools`, {
        headers: {},
        data: {
          id: payload,
        },
      })
      dispatch('getSchools')
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
