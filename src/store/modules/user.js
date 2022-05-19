import Vue from 'vue'
import axios from 'axios'
import router from '@/router/index'

const userModule = {
  state: () => ({
    user: {
      _id: null,
      name: '',
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
    removePayment(state, eventStart) {
      const paymentIndex = state.user.payments.findIndex((p) => {
        return p.date === eventStart
      })
      state.user.payments.splice(paymentIndex, 1)
    },
    addPayment(state, payload) {
      state.user.payments.push(payload)
    },
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
      Object.assign(state.user, payload)
      // state.user = payload
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
    async insertUser({rootState, dispatch}, user) {
      await axios.post(`${rootState.apiUrl}/users`, user)
      dispatch('getUsers')
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
    studentEvents(state, getters, rootState, rootGetters) {
      return rootGetters.events.filter((e) => {
        return e.student._id === state.user._id
      })
    },
    instructorEvents(state, getters, rootState, rootGetters) {
      return rootGetters.events.filter((e) => {
        return e.instructor._id === state.user._id
      })
    },
    studentPayments: state => state.user.payments,
    users: state => state.users,
    instructors(state) {
      return state.users.filter((u) => {
        return u.role.role === 'Инструктор'
      })
    },
    students(state) {
      return state.users.filter((u) => {
        return u.role.role === 'Ученик'
      })
    },
    roles: state => state.roles,
    isLogin: state => !!state.user._id,
    isAdmin(state) {
      return state.user.role.role === 'Администратор'
    },
    isInstructor(state) {
      return state.user.role.role === 'Инструктор'
    },
    isStudent(state) {
      return state.user.role.role === 'Ученик'
    },
    userHasCourse: state => !!state.user.course.cost,
    allUserDrivingsSum(state) {
      const driving = state.user.payments.filter((p) => {
        return p.type === '622f0b6c86788d850dc496f4' // тип вождение
      })
      return driving.reduce((acc, value) => {
        return acc + value.sum
      }, 0)
    },
    drivingIsAvailable(state, getters) {
      return getters.availableSumForDriving > state.user.course.driving.cost
    },
    availableSumForDriving(state, getters) {
      const realMoney = state.user.payments.filter((p) => {
        return p.type === '624e693d1d606f93efc3e444' // тип фактический взнос денег
      })
      const realMoneySum = realMoney.reduce((acc, value) => {
        return acc + value.sum
      }, 0)
      return realMoneySum - getters.allUserDrivingsSum - (state.user.course.theory.cost - state.user.course.theory.discount) - (state.user.course.driving.cost * 4)
    },
    themeIsDark: state => state.user.theme === 'dark',
  }
}

export default userModule
