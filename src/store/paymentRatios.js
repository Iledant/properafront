import * as types from './mutation-types'
import Vue from 'vue'
import { handleRequest } from './loading.js'

const state = {
  paymentTypes: [],
  paymentRatios: [],
  yearPaymentRatios: []
}

const getters = {
  paymentTypes: state => state.paymentTypes
}

const actions = {
  async [types.GET_PAYMENT_TYPES] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('payment_types'),
      body => commit(types.GET_PAYMENT_TYPES, body.PaymentType)
    )
  },
  async [types.GET_YEAR_PAYMENT_RATIOS] ({ commit }, { Year }) {
    return handleRequest(
      commit,
      _ => Vue.http.get(`payment_ratios/year?Year=${Year}`),
      body => {
        const ratios = body.Ratios.map(r => ({
          index: parseInt(r.index),
          ratio: parseFloat(r.ratio)
        }))
        commit(types.GET_YEAR_PAYMENT_RATIOS, ratios)
      }
    )
  },
  async [types.GET_PAYMENT_RATIOS] ({ commit }, { id }) {
    return handleRequest(
      commit,
      _ => Vue.http.get(`payment_types/${id}/payment_ratios`),
      body => commit(types.GET_PAYMENT_RATIOS, body.PaymentRatio)
    )
  },
  async [types.UPDATE_PAYMENT_TYPE] ({ commit }, { id, name }) {
    return handleRequest(
      commit,
      _ => Vue.http.put(`payment_types/${id}`, { name }),
      body => commit(types.UPDATE_PAYMENT_TYPE, body.PaymentType)
    )
  },
  async [types.DELETE_PAYMENT_TYPE] ({ commit }, { id }) {
    return handleRequest(
      commit,
      _ => Vue.http.delete(`payment_types/${id}`),
      _ => commit(types.DELETE_PAYMENT_TYPE, id)
    )
  },
  async [types.ADD_PAYMENT_TYPE] ({ commit }, { name }) {
    return handleRequest(
      commit,
      _ => Vue.http.post('payment_types', { name }),
      body => commit(types.ADD_PAYMENT_TYPE, body.PaymentType)
    )
  },
  async [types.ADD_YEAR_RATIOS] ({ commit }, { name, ratios }) {
    return handleRequest(
      commit,
      _ => Vue.http.post('payment_types', { name }),
      async body => {
        const newPaymentType = body.PaymentType
        commit(types.ADD_PAYMENT_TYPE, newPaymentType)
        await Vue.http.post(`payment_types/${newPaymentType.id}/payment_ratios`,
          { PaymentRatio: ratios })
      }
    )
  },
  async [types.SET_PAYMENT_RATIOS] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.post(
        `payment_types/${payload[0].payment_types_id}/payment_ratios`,
        { PaymentRatio: payload }
      ),
      body => commit(types.GET_PAYMENT_RATIOS, body.PaymentRatio)
    )
  }
}

const mutations = {
  [types.GET_PAYMENT_TYPES] (state, payload) {
    state.paymentTypes = [...payload]
  },
  [types.GET_YEAR_PAYMENT_RATIOS] (state, payload) {
    state.yearPaymentRatios = [...payload]
  },
  [types.GET_PAYMENT_RATIOS] (state, payload) {
    state.paymentRatios = [...payload]
  },
  [types.ADD_PAYMENT_TYPE] (state, paymentType) {
    state.paymentTypes.push(paymentType)
  },
  [types.UPDATE_PAYMENT_TYPE] (state, paymentType) {
    const index = state.paymentTypes.findIndex(p => p.id === paymentType.id)
    state.paymentTypes.splice(index, 1, paymentType)
  },
  [types.DELETE_PAYMENT_TYPE] (state, id) {
    const index = state.paymentTypes.findIndex(p => p.id === id)
    state.paymentTypes.splice(index, 1)
  }
}

export default { state, getters, actions, mutations }
