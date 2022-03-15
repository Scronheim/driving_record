import Vue from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
import router from '@/router/index'

const userModule = {
  state: () => ({
    user: {
      _id: null,
      username: null,
      email: null,
      avatar: null,
      cityId: null,
      city: {},
      role: {},
      school: {},
    },
    token: null,
    students: [],
    roles: [],
    userEvents: [],
    eventTypes: [],
    paymentTypes: [],
  }),
  mutations: {
    removeEvent(state, index) {
      state.userEvents.splice(index)
      console.log(index, state.userEvents)
    },
    setPaymentTypes(state, types) {
      state.paymentTypes = types
    },
    setEventTypes(state, types) {
      state.eventTypes = types
    },
    setUserEvents(state, events) {
      state.userEvents = events
    },
    getToken(state) {
      const token = localStorage.getItem('token')
      if (token) {
        state.token = token
      }
    },
    setRoles(state, payload) {
      state.roles = payload
    },
    setUser(state, payload) {
      state.user = payload
    },
    setStudents(state, payload) {
      state.students = payload
    },
    clearUser(state) {
      state.user = {
        _id: null,
        username: null,
        email: null,
        avatar: null,
        cityId: null,
        city: {},
        roles: [],
        school: {},
      }
    }
  },
  actions: {
    async getPaymentTypes({commit, rootState}) {
      const {data} = await axios.get(`${rootState.apiUrl}/payment_types`)
      commit('setPaymentTypes', data.data)
    },
    async getEventTypes({commit, rootState}) {
      const {data} = await axios.get(`${rootState.apiUrl}/event_types`)
      commit('setEventTypes', data.data)
    },
    async getUserEvents({commit, rootState}, userId) {
      const {data} = await axios.get(`${rootState.apiUrl}/events?id=${userId}`)
      data.data.forEach((e) => {
        e.start = dayjs(e.start).format('YYYY-MM-DD HH:mm')
        e.end = dayjs(e.end).format('YYYY-MM-DD HH:mm')
        e.name = e.type.name
        e.color = e.type.color
        // e.start = dayjs(e.start).format('YYYY-MM-DD hh:mm:ss')
        // e.end = dayjs(e.end).format('YYYY-MM-DD hh:mm:ss')
      })
      commit('setUserEvents', data.data)
    },
    async verifyRecaptchaToken({rootState}, token) {
      return await axios.post(`${rootState.apiUrl}/recaptcha`, {token})
    },
    async getRoles({commit, rootState}) {
      const {data} = await axios.get(`${rootState.apiUrl}/roles`)
      commit('setRoles', data.data)
    },
    async getStudents({commit, rootState}) {
      const {data} = await axios.get(`${rootState.apiUrl}/students`)
      commit('setStudents', data.data)
    },
    async updateStudent({rootState, dispatch}, payload) {
      await axios.patch(`${rootState.apiUrl}/students`, payload)
      dispatch('getStudents')
    },
    async aboutMe({commit, rootState}) {
      const token = localStorage.getItem('token')
      axios.defaults.headers.common['x-access-token'] = token
      const {data} = await axios.get(`${rootState.apiUrl}/me`, {headers: {'x-access-token': token}})
      commit('setUser', data.data)
    },
    async login({commit, dispatch, rootState}, payload) {
      try {
        const {data} = await axios.post(`${rootState.apiUrl}/auth/signin`, payload)
        commit('setUser', data.data.user)
        localStorage.setItem('token', data.data.token)
        axios.defaults.headers.common['x-access-token'] = data.data.token
        dispatch('getStudents')
        dispatch('getEventTypes')
        dispatch('getRoles')
        router.push('/profile')
      } catch (e) {
        Vue.$toast.error(e.response.data.error)
        localStorage.removeItem('token')
      }
    },
    register({rootState}, payload) {
      return axios.post(`${rootState.apiUrl}/auth/signup`, payload)
    },
    logout({commit}) {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['x-access-token']
      commit('clearUser')
      router.push('/')
    }
  },
  getters: {
    token: state => state.token,
    userEvents: state => state.userEvents,
    eventTypes: state => state.eventTypes,
    paymentTypes: state => state.paymentTypes,
    user: state => state.user,
    students: state => state.students,
    roles: state => state.roles,
    isLogin: state => !!state.user._id,
    isAdmin: function (state) {
      return state.user.role.role === 'Администратор'
    },
    isModerator: function (state) {
      const admin = state.user.roles.find((r) => {
        return r.name === 'moderator'
      })
      return !!admin
    },
  }
}

export default userModule
