import * as types from './mutation-types'
import Vue from 'vue'
import { handleRequest } from './loading.js'

const state = {
  commissions: [],
  programmings: [],
  programmingsYears: [],
  prevCommitmentTotal: null
}

const actions = {
  async [types.GET_COMMISSIONS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('commissions'),
      body => commit(types.GET_COMMISSIONS, body.Commissions)
    )
  },
  async [types.ADD_COMMISSION] ({ commit }, { Commission }) {
    return handleRequest(
      commit,
      _ => Vue.http.post('commissions', Commission),
      body => commit(types.ADD_COMMISSION, body.Commissions)
    )
  },
  async [types.DEL_COMMISSION] ({ commit }, { Commission }) {
    return handleRequest(
      commit,
      _ => Vue.http.delete(`commissions/${Commission.id}`),
      _ => commit(types.DEL_COMMISSION, Commission)
    )
  },
  async [types.UPDATE_COMMISSION] ({ commit }, { Commission }) {
    return handleRequest(
      commit,
      _ => Vue.http.put(`commissions/${Commission.id}`, Commission),
      body => commit(types.UPDATE_COMMISSION, body.Commissions)
    )
  },
  async [types.GET_PROGRAMMINGS] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.get('programmings', { params: payload }),
      body => {
        commit(types.GET_PROGRAMMINGS, body.Programmings)
        commit(types.GET_PROGRAMMINGS_NEEDS, body.PrevCommitmentTotal)
      }
    )
  },
  async [types.GET_PROGRAMMINGS_YEARS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('programmings/years'),
      body => commit(types.GET_PROGRAMMINGS_YEARS, body.ProgrammingsYears)
    )
  },
  async [types.SET_PROGRAMMINGS] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.post('programmings/array', payload),
      body => commit(types.GET_PROGRAMMINGS, body.Programmings)
    )
  }
}

const mutations = {
  [types.SET_ERROR_MESSAGE] (state, message) {
    state.programmingsErrorMessage = message
  },
  [types.ADD_COMMISSION] (state, commission) {
    state.commissions.push(commission)
  },
  [types.DEL_COMMISSION] (state, commission) {
    state.commissions.splice(state.commissions.indexOf(commission), 1)
  },
  [types.GET_COMMISSIONS] (state, commissions) {
    state.commissions = [...commissions]
  },
  [types.UPDATE_COMMISSION] (state, commission) {
    const index = state.commissions.findIndex(p => p.id === commission.id)
    state.commissions.splice(index, 1, commission)
  },
  [types.GET_PROGRAMMINGS] (state, programmings) {
    state.programmings = [...programmings]
  },
  [types.GET_PROGRAMMINGS_NEEDS] (state, total) {
    state.prevCommitmentTotal = total
  },
  [types.GET_PROGRAMMINGS_YEARS] (state, programmingsYears) {
    state.programmingsYears = [...programmingsYears]
  }
}

export default { state, actions, mutations }
