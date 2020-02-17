import * as types from './mutation-types'
import Vue from 'vue'
import { handleRequest } from './loading.js'

const state = {
  planLines: [],
  detailedPlanLines: [],
  planLineBeneficiaries: []
}

const actions = {
  async [types.GET_PLAN_LINES] ({ commit }, { id }) {
    return handleRequest(
      commit,
      _ => Vue.http.get(`plans/${id}/planlines`),
      body => {
        commit(types.GET_PLAN_LINES, body.PlanLine)
        commit(types.GET_PLAN_LINES_BENEFICIARIES, body.Beneficiary)
      }
    )
  },
  async [types.GET_DETAILED_PLAN_LINES] ({ commit }, { id }) {
    return handleRequest(
      commit,
      _ => Vue.http.get(`plans/${id}/planlines/detailed`),
      body => commit(types.GET_DETAILED_PLAN_LINES, body.DetailedPlanLine)
    )
  },
  async [types.ADD_PLAN_LINE] ({ commit }, { id, planLine }) {
    return handleRequest(
      commit,
      _ => Vue.http.post(`plans/${id}/planlines`, planLine),
      body => commit(types.ADD_PLAN_LINE, body.PlanLine)
    )
  },
  async [types.DEL_PLAN_LINE] ({ commit }, { id, planLine }) {
    return handleRequest(
      commit,
      _ => Vue.http.delete(`plans/${id}/planlines/${planLine.id}`),
      _ => commit(types.DEL_PLAN_LINE, planLine)
    )
  },
  async [types.UPDATE_PLAN_LINE] ({ commit }, { id, planLine }) {
    return handleRequest(
      commit,
      _ => Vue.http.put(`plans/${id}/planlines/${planLine.id}`, planLine),
      body => commit(types.UPDATE_PLAN_LINE, body.PlanLine)
    )
  }
}

const mutations = {
  [types.ADD_PLAN_LINE] (state, planLine) {
    state.planLines.push(planLine)
  },
  [types.DEL_PLAN_LINE] (state, planLine) {
    state.planLines.splice(state.planLines.indexOf(planLine), 1)
  },
  [types.GET_PLAN_LINES] (state, lines) {
    state.planLines = [...lines]
  },
  [types.GET_DETAILED_PLAN_LINES] (state, lines) {
    state.detailedPlanLines = [...lines]
  },
  [types.GET_PLAN_LINES_BENEFICIARIES] (state, lines) {
    state.planLineBeneficiaries = [...lines]
  },
  [types.UPDATE_PLAN_LINE] (state, planLine) {
    const index = state.planLines.findIndex(p => p.id === planLine.id)
    state.planLines.splice(index, 1, planLine)
  }
}

export default { state, actions, mutations }
