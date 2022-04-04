import axios from 'axios'

const courseModule = {
  state: () => ({
    courses: [],
  }),
  mutations: {
    setCourses(state, courses) {
      state.courses = courses
    },
  },
  actions: {
    async updateCourse({rootState, dispatch}, course) {
      await axios.patch(`${rootState.apiUrl}/courses`, course)
      dispatch('getCourses')
    },
    async getCourses({commit, rootState}) {
      const {data} = await axios.get(`${rootState.apiUrl}/courses`)
      commit('setCourses', data.data)
    },
  },
  getters: {
    courses: state => state.courses,
  }
}

export default courseModule
