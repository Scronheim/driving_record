import Vue from 'vue'
import axios from 'axios'
import router from '@/router/index'

const userModule = {
  state: () => ({
    user: {
      _id: null,
      name: null,
      email: null,
      role: {},
      school: {},
      group: {},
      phone: null,
      disabled: false,
      added: false,
      car: null,
      payments: [],
      course: {
        driving: {},
        theory: {},
      },
    },
    users: [],
    token: null,
    paymentTypes: [],
  }),
  mutations: {
    setCourseToUser(state, course) {
      state.user.course = course
    },
    setPaymentTypes(state, types) {
      state.paymentTypes = types
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
        name: null,
        email: null,
        role: {},
        school: {},
        group: {},
        phone: null,
        disabled: false,
        added: false,
        car: null,
        payments: [],
        course: {
          driving: {},
          theory: {},
        },
      }
    }
  },
  actions: {
    async getPaymentTypes({commit, rootState}) {
      const {data} = await axios.get(`${rootState.apiUrl}/payment_types`)
      commit('setPaymentTypes', data.data)
    },
    async verifyRecaptchaToken({rootState}, token) {
      return await axios.post(`${rootState.apiUrl}/recaptcha`, {token})
    },
    async getRoles({commit, rootState}) {
      const {data} = await axios.get(`${rootState.apiUrl}/roles`)
      commit('setRoles', data.data)
    },
    async getUsers({commit, rootState}) {
      const {data} = await axios.get(`${rootState.apiUrl}/users`)
      commit('setUsers', data.data)
    },
    async updateUser({rootState, dispatch, state}, payload) {
      const user = payload ? payload : state.user
      await axios.patch(`${rootState.apiUrl}/users`, user)
      dispatch('aboutMe')
      dispatch('getUsers')
    },
    async changePassword({rootState}, payload) {
      await axios.patch(`${rootState.apiUrl}/change_password`, payload)
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
        await dispatch('getAllData')
        switch (data.data.user.role.role) {
          case 'Ученик':
            await router.push('/')
            break
          case 'Администратор':
            await router.push('/admin')
            break
          case 'Инструктор':
            await router.push('/profile')
            break
        }

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
    paymentTypes: state => state.paymentTypes,
    user: state => state.user,
    userEvents: function (state, getters, rootState, rootGetters) {
      return rootGetters.events.filter((e) => {
        return e.student._id === state.user._id
      })
    },
    userPayments: state => state.user.payments,
    users: state => state.users,
    instructors: function (state) {
      return state.users.filter((u) => {
        return u.role.role === 'Инструктор'
      })
    },
    students: function (state) {
      return state.users.filter((u) => {
        return u.role.role === 'Ученик'
      })
    },
    roles: state => state.roles,
    isLogin: state => !!state.user._id,
    isAdmin: function (state) {
      return state.user.role.role === 'Администратор'
    },
    isInstructor: function (state) {
      return state.user.role.role === 'Инструктор'
    },
    isStudent: function (state) {
      return state.user.role.role === 'Ученик'
    },
    userHasCourse: state => !!state.user.course,
  }
}

export default userModule
