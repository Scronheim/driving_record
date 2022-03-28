import axios from 'axios'

const eventModule = {
  state: () => ({
    events: [],
    eventTypes: [],
    eventStatuses: [],
  }),
  mutations: {
    setEvents(state, events) {
      state.events = events
    },
    setEventTypes(state, types) {
      state.eventTypes = types
    },
    setEventStatuses(state, statuses) {
      state.eventStatuses = statuses
    },
    addEvent(state, event) {
      state.events.push(event)
    },
    removeEvent(state, eventIndex) {
      state.events.splice(eventIndex, 1)
    },
  },
  actions: {
    async getEvents({commit, rootState}) {
      const {data} = await axios.get(`${rootState.apiUrl}/events`)
      commit('setEvents', data.data)
    },
    async getEventTypes({commit, rootState}) {
      const {data} = await axios.get(`${rootState.apiUrl}/event_types`)
      commit('setEventTypes', data.data)
    },
    async getEventStatuses({commit, rootState}) {
      const {data} = await axios.get(`${rootState.apiUrl}/event_statuses`)
      commit('setEventStatuses', data.data)
    },
    async addNewEvents({rootState, dispatch}, events) {
      await axios.post(`${rootState.apiUrl}/events`, events)
      dispatch('getEvents')
    }
  },
  getters: {
    events: state => state.events,
    eventTypes: state => state.eventTypes,
    eventStatuses: state => state.eventStatuses,
  }
}

export default eventModule
