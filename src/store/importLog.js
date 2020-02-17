import * as types from './mutation-types'
import Vue from 'vue'
import { handleRequest } from './loading.js'

const state = {
  paymentLastDate: null,
  commitmentLastDate: null,
  pendingsLastDate: null
}

const actions = {
  async [types.GET_IMPORT_LOG] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('import_log'),
      body => commit(types.GET_IMPORT_LOG, body.ImportLog)
    )
  }
}

const mutations = {
  [types.GET_IMPORT_LOG] (state, payload) {
    payload.forEach(l => {
      switch (l.category) {
        case 'Payments':
          state.paymentLastDate = l.last_date
          break
        case 'FinancialCommitments':
          state.commitmentLastDate = l.last_date
          break
        case 'Pendings':
          state.pendingsLastDate = l.last_date
      }
    })
  }
}

export default { state, actions, mutations }
