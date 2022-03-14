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
      const {data} = await axios.get(`${rootState.apiUrl}/api/instructors`)
      commit('setInstructors', data.data)
    },
  },
  getters: {
    instructors: state => state.instructors,
  }
}

export default instructorModule
