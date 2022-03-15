import axios from 'axios'

const instructorModule = {
  state: () => ({
    instructors: [],
  }),
  mutations: {
    setInstructors(state, instructors) {
      state.instructors = instructors
    },
  },
  actions: {
    async getInstructors({commit, rootState}) {
      const {data} = await axios.get(`${rootState.apiUrl}/instructors`)
      commit('setInstructors', data.data)
    },
    async addNewInstructor({rootState, dispatch}, payload) {
      await axios.post(`${rootState.apiUrl}/instructor`, payload)
      await dispatch('getInstructors')
    },
    async updateInstructor({rootState, dispatch}, payload) {
      await axios.patch(`${rootState.apiUrl}/instructor`, payload)
      await dispatch('getInstructors')
    }
  },
  getters: {
    instructors: state => state.instructors,
  }
}

export default instructorModule
