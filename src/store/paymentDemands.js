import * as types from './mutation-types'
import Vue from 'vue'
import { handleRequest } from './loading.js'

const state = {
  paymentDemands: [],
  paymentDemandCount: [],
  paymentDemandsStock: []
}

const actions = {
  async [types.UPLOAD_PAYMENT_DEMANDS] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.post('payment_demands', payload),
      _ => {}
    )
  },
  async [types.GET_PAYMENT_DEMANDS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('payment_demands'),
      body => commit(types.GET_PAYMENT_DEMANDS, body.PaymentDemand)
    )
  },
  async [types.GET_PAYMENT_DEMANDS_STOCK] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('payment_demand_stocks'),
      body => commit(types.GET_PAYMENT_DEMANDS_STOCK, body.PaymentDemandsStock)
    )
  },
  async [types.UPDATE_PAYMENT_DEMAND] ({ commit }, { PaymentDemand }) {
    return handleRequest(
      commit,
      _ => Vue.http.put('payment_demands', { PaymentDemand }),
      body => commit(types.UPDATE_PAYMENT_DEMAND, body.PaymentDemand)
    )
  }
}

const mutations = {
  [types.GET_PAYMENT_DEMANDS] (state, list) {
    state.paymentDemands = [...list]
  },
  [types.UPDATE_PAYMENT_DEMAND] (state, paymentDemand) {
    const index = state.paymentDemands.findIndex(p => p.id === paymentDemand.id)
    if (index !== -1) {
      state.paymentDemands.splice(index, 1, paymentDemand)
    }
  },
  [types.GET_PAYMENT_DEMAND_COUNTS] (state, list) {
    state.paymentDemandCount = [...list]
  },
  [types.GET_PAYMENT_DEMANDS_STOCK] (state, list) {
    state.paymentDemandsStock = [...list]
  }
}

export default { state, actions, mutations }
