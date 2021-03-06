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
    removeEvents(state, payload) {
      state.events.splice(payload.eventIndex, payload.count)
    },
    updateEvent(state, event) {
      const events = state.events.filter((e) => {
        return e._id !== event._id
      })
      events.push(event)
      state.events = events
    },
  },
  actions: {
    async updateEvent({rootState, dispatch}, event) {
      await axios.patch(`${rootState.apiUrl}/events`, event)
      dispatch('getEvents')
    },
    async removeEvent({rootState, dispatch}, eventId) {
      await axios.delete(`${rootState.apiUrl}/events`, {
        headers: {},
        data: {
          id: eventId
        }
      })
      dispatch('getEvents')
    },
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
