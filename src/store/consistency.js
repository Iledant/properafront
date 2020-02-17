import * as types from './mutation-types'
import Vue from 'vue'
import { handleRequest } from './loading.js'

const state = {
  commitmentsWithoutAction: [],
  unlinkedPayments: [],
  possibleLinkedCmts: []
}

const actions = {
  async [types.GET_CONSISTENCY_DATAS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('consistency/datas'),
      body => {
        commit(types.GET_CONSISTENCY_DATAS, body)
      }
    )
  },
  async [types.GET_POSSIBLE_CMTS] ({ commit }, id) {
    return handleRequest(
      commit,
      _ => Vue.http.get(`payment/${id}/possible_linked_commitment`),
      body => {
        commit(types.GET_POSSIBLE_CMTS, body.Commitment)
      }
    )
  },
  async [types.LINK_PAYMENT_CMT] ({ commit }, { PaymentId, CmtId }) {
    return handleRequest(
      commit,
      _ => Vue.http.post(`payment/${PaymentId}/link_commitment/${CmtId}`),
      _ => {
        commit(types.LINK_PAYMENT_CMT, PaymentId)
      }
    )
  }
}

const mutations = {
  [types.GET_CONSISTENCY_DATAS] (state, payload) {
    state.commitmentsWithoutAction = payload.CommitmentWithoutAction
    state.unlinkedPayments = payload.UnlinkedPayment
  },
  [types.GET_POSSIBLE_CMTS] (state, list) {
    state.possibleLinkedCmts = [...list]
  },
  [types.LINK_PAYMENT_CMT] (state, PaymentId) {
    const idx = state.unlinkedPayments.findIndex(p => p.id === PaymentId)
    state.unlinkedPayments.splice(idx, 1)
    state.possibleLinkedCmts = []
  }
}

export default { state, actions, mutations }
