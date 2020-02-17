import * as types from './mutation-types'
import Vue from 'vue'
import { handleRequest } from './loading.js'

const actions = {
  async [types.ADD_FINANCIAL_COMMITMENTS] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.post('financial_commitments', payload),
      _ => {}
    )
  },
  async [types.ADD_PAYMENTS] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.post('payments', payload),
      _ => {}
    )
  },
  async [types.ADD_PENDINGS] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.post('pending_commitments', payload),
      _ => {}
    )
  },
  async [types.UPLOAD_PREVCOMMITMENTS] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.post('prevcommitments', payload),
      _ => {}
    )
  },
  async [types.ADD_PHYSICAL_OPS] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.post('physical_ops/array', payload),
      _ => {}
    )
  },
  async [types.ADD_PROGRAMMINGS] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.post('programmings/upload2', payload),
      _ => {}
    )
  },
  async [types.UPLOAD_PAYMENT_CREDITS] ({ commit }, { PaymentCredit }) {
    return handleRequest(
      commit,
      _ => Vue.http.post('payment_credits', { PaymentCredit }),
      _ => {}
    )
  },
  async [types.UPLOAD_PAYMENT_CREDITS_JOURNAL] (
    { commit },
    { PaymentCreditJournal }
  ) {
    return handleRequest(
      commit,
      _ => Vue.http.post('payment_credits/journal', { PaymentCreditJournal }),
      _ => {}
    )
  },
  async [types.UPLOAD_PLAN_LINE] ({ commit }, { id, PlanLine }) {
    return handleRequest(
      commit,
      _ => Vue.http.post(`plans/${id}/planlines/array`, { PlanLine }),
      _ => {}
    )
  }
}

export default { actions }
