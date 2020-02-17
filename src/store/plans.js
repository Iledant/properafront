import * as types from './mutation-types'
import Vue from 'vue'
import { handleRequest } from './loading.js'

const state = {
  plans: []
}

const actions = {
  async [types.GET_PLANS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('plans'),
      body => commit(types.GET_PLANS, body.Plan)
    )
  },
  async [types.ADD_PLAN] ({ commit }, { plan }) {
    return handleRequest(
      commit,
      _ => Vue.http.post('plans', plan),
      body => commit(types.ADD_PLAN, body.Plan)
    )
  },
  async [types.DEL_PLAN] ({ commit }, { plan }) {
    return handleRequest(
      commit,
      _ => Vue.http.delete(`plans/${plan.id}`),
      _ => commit(types.DEL_PLAN, plan)
    )
  },
  async [types.UPDATE_PLAN] ({ commit }, { plan }) {
    return handleRequest(
      commit,
      _ => Vue.http.put(`plans/${plan.id}`, plan),
      body => commit(types.UPDATE_PLAN, body.Plan)
    )
  }
}

const mutations = {
  [types.ADD_PLAN] (state, plan) {
    state.plans.push(plan)
  },
  [types.DEL_PLAN] (state, plan) {
    state.plans.splice(state.plans.indexOf(plan), 1)
  },
  [types.GET_PLANS] (state, ops) {
    state.plans = [...ops]
  },
  [types.UPDATE_PLAN] (state, plan) {
    const index = state.plans.findIndex(p => p.id === plan.id)
    state.plans.splice(index, 1, plan)
  }
}

export default { state, actions, mutations }
