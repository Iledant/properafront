import * as types from './mutation-types'
import Vue from 'vue'
import { handleRequest } from './loading.js'

const state = {
  preProgrammings: []
}

// getters
const getters = {
  preProgrammings: state => state.preProgrammings
}

// actions
const actions = {
  async [types.GET_PRE_PROGRAMMINGS] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.get('pre_programmings', { params: payload }),
      body => commit(types.GET_PRE_PROGRAMMINGS, body.PreProgrammings)
    )
  },
  async [types.SET_PRE_PROGRAMMINGS] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.post('pre_programmings', payload),
      body => commit(types.GET_PRE_PROGRAMMINGS, body.PreProgrammings)
    )
  }
}

// mutations
const mutations = {
  [types.GET_PRE_PROGRAMMINGS] (state, payload) {
    state.preProgrammings = [...payload]
  }
}

export default { state, getters, actions, mutations }
