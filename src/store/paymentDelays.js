import * as types from './mutation-types'
import Vue from 'vue'
import { handleRequest } from './loading.js'

const state = {
  paymentDelays: []
}

const actions = {
  [types.GET_PAYMENT_DELAYS] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.get('payment_delays', { params: payload }),
      body => commit(types.GET_PAYMENT_DELAYS, body.payment_delay)
    )
  }
}

const mutations = {
  [types.GET_PAYMENT_DELAYS] (state, list) {
    state.paymentDelays = [...list]
  }
}

export default { state, actions, mutations }
