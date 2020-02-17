import * as types from './mutation-types'
import Vue from 'vue'
import { handleRequest } from './loading.js'

const state = {
  beneficiaries: [],
  beneficiaryCmt: []
}

const actions = {
  async [types.GET_BENEFICIARIES] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('beneficiaries'),
      body => commit(types.GET_BENEFICIARIES, body.Beneficiary)
    )
  },
  async [types.UPDATE_BENEFICIARY] ({ commit }, { id, name }) {
    return handleRequest(
      commit,
      _ => Vue.http.put(`beneficiaries/${id}`, { name }),
      body => commit(types.UPDATE_BENEFICIARY, body.Beneficiary)
    )
  },
  async [types.GET_BENEFICIARY_COMMITMENT] ({ commit }, id) {
    return handleRequest(
      commit,
      _ => Vue.http.get(`beneficiary/${id}/commitment`),
      body => commit(types.GET_BENEFICIARY_COMMITMENT, body.BeneficiaryCommitment)
    )
  }
}

const mutations = {
  [types.GET_BENEFICIARIES] (state, payload) {
    state.beneficiaries = [...payload]
  },
  [types.UPDATE_BENEFICIARY] (state, payload) {
    const index = state.beneficiaries.findIndex(p => p.id === payload.id)
    state.beneficiaries.splice(index, 1, payload)
  },
  [types.GET_BENEFICIARY_COMMITMENT] (state, payload) {
    state.beneficiaryCmt = [...payload]
  }
}

export default { state, actions, mutations }
