import Vue from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'

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
    },
    token: null,
    users: [],
    roles: [],
    userEvents: [],
    eventTypes: [],
  }),
  mutations: {
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
    setUsers(state, payload) {
      state.users = payload
    },
    clearUser(state) {
      state.user = {
        _id: null,
        username: null,
        email: null,
        avatar: null,
        cityId: null,
        city: {},
        roles: []
      }
    }
  },
  actions: {
    async getEventTypes({commit}) {
      const {data} = await axios.get('/api/event_types')
      commit('setEventTypes', data.data)
    },
    async getUserEvents({commit}, userId) {
      const {data} = await axios.get(`/api/events?id=${userId}`)
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
    async verifyRecaptchaToken(context, token) {
      return await axios.post('/api/recaptcha', {token})
    },
    async getRoles({commit}) {
      const {data} = await axios.get(`/api/roles`)
      commit('setRoles', data.data)
    },
    async getUsers({commit}) {
      const {data} = await axios.get(`/api/users`)
      commit('setUsers', data.data)
    },
    async searchCity(context, payload) {
      return await axios.get(`/api/cities?search=${payload}`)
    },
    async insertUser(context, payload) {
      return await axios.post('/api/user', payload)
    },
    async updateUser(context, payload) {
      return await axios.patch('/api/user', payload)
    },
    async aboutMe({commit}) {
      const token = localStorage.getItem('token')
      axios.defaults.headers.common['x-access-token'] = token
      const {data} = await axios.get('/api/user/me', {headers: {'x-access-token': token}})
      commit('setUser', data.data)
    },
    async login({commit}, payload) {
      try {
        const {data} = await axios.post('/api/auth/signin', payload)
        commit('setUser', data.data.user)
        localStorage.setItem('token', data.data.token)
        axios.defaults.headers.common['x-access-token'] = data.data.token
        console.log(data.data.token)
      } catch (e) {
        Vue.$toast.error(e.response.data.error)
        localStorage.removeItem('token')
      }
    },
    register(context, payload) {
      return axios.post('/api/auth/signup', payload)
    },
    logout({commit}) {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['x-access-token']
      commit('clearUser')
    }
  },
  getters: {
    token: state => state.token,
    userEvents: state => state.userEvents,
    eventTypes: state => state.eventTypes,
    user: state => state.user,
    users: state => state.users,
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
