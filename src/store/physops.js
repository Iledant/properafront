import * as types from './mutation-types'
import Vue from 'vue'
import { handleRequest } from './loading.js'

const state = {
  ops: [],
  events: [],
  rights: [],
  opsWithPrevisions: []
}

const actions = {
  async [types.GET_PHYSICAL_OPS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('physical_ops'),
      body => {
        commit(types.GET_PHYSICAL_OPS, body.PhysicalOp)
        commit(types.GET_PAYMENT_TYPES, body.PaymentType)
        commit(types.GET_STEPS, body.Step)
        commit(types.GET_CATEGORIES, body.Category)
        commit(types.GET_BUDGET_ACTIONS, body.BudgetAction)
      }
    )
  },
  async [types.ADD_PHYSICAL_OP] ({ commit }, { op }) {
    return handleRequest(
      commit,
      _ => Vue.http.post('physical_ops', op),
      body => commit(types.ADD_PHYSICAL_OP, body.PhysicalOp)
    )
  },
  async [types.DEL_PHYSICAL_OP] ({ commit }, { op }) {
    return handleRequest(
      commit,
      _ => Vue.http.delete('physical_ops/' + op.id),
      _ => commit(types.DEL_PHYSICAL_OP, op)
    )
  },
  async [types.UPDATE_PHYSICAL_OP] ({ commit }, { op }) {
    return handleRequest(
      commit,
      _ => Vue.http.put(`physical_ops/${op.id}`, op),
      body => commit(types.UPDATE_PHYSICAL_OP, body.PhysicalOp)
    )
  },
  async [types.GET_EVENTS] ({ commit }, { id }) {
    return handleRequest(
      commit,
      _ => Vue.http.get(`physical_ops/${id}/events`),
      body => commit(types.GET_EVENTS, body.Event)
    )
  },
  async [types.ADD_EVENT] ({ commit }, { id, event }) {
    return handleRequest(
      commit,
      _ => Vue.http.post(`physical_ops/${id}/events`, event),
      body => commit(types.ADD_EVENT, body.Event)
    )
  },
  async [types.UPDATE_EVENT] ({ commit }, { id, event }) {
    return handleRequest(
      commit,
      _ => Vue.http.put(`physical_ops/${id}/events/${event.id}`, event),
      body => commit(types.UPDATE_EVENT, body.Event)
    )
  },
  async [types.DEL_EVENT] ({ commit }, { id, event }) {
    return handleRequest(
      commit,
      _ => Vue.http.delete(`physical_ops/${id}/events/${event.id}`),
      _ => commit(types.DEL_EVENT, event)
    )
  },
  async [types.GET_NEXT_MONTH_EVENTS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('events'),
      body => commit(types.GET_NEXT_MONTH_EVENTS, body.Event)
    )
  },
  async [types.GET_RIGHTS] ({ commit }, { userId }) {
    return handleRequest(
      commit,
      _ => Vue.http.get(`user/${userId}/rights`),
      body => {
        commit(types.GET_RIGHTS, body.Right)
        commit(types.GET_PHYSICAL_OPS, body.PhysicalOp)
        commit(types.GET_USERS, body.User)
      }
    )
  },
  async [types.SET_RIGHTS] ({ commit }, { UserId, Right }) {
    return handleRequest(
      commit,
      _ => Vue.http.post(`user/${UserId}/rights`, { Right }),
      body => commit(types.GET_RIGHTS, body.Right)
    )
  },
  async [types.INHERIT_RIGHTS] ({ commit }, { UserId, Right }) {
    return handleRequest(
      commit,
      _ => Vue.http.post(`user/${UserId}/inherit`, { Right }),
      body => commit(types.GET_RIGHTS, body.Right)
    )
  },
  async [types.ADD_ATTACHMENTS] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.post('financial_commitments/attachments', payload),
      null
    )
  }
}

const mutations = {
  [types.ADD_PHYSICAL_OP] (state, op) {
    state.ops.push(op)
  },
  [types.DEL_PHYSICAL_OP] (state, op) {
    state.ops.splice(state.ops.indexOf(op), 1)
  },
  [types.GET_PHYSICAL_OPS] (state, ops) {
    state.ops = [...ops]
  },
  [types.UPDATE_PHYSICAL_OP] (state, op) {
    const index = state.ops.findIndex(p => p.id === op.id)
    state.ops.splice(index, 1, op)
  },
  [types.GET_EVENTS] (state, events) {
    state.events = [...events]
  },
  [types.ADD_EVENT] (state, event) {
    state.events.push(event)
  },
  [types.UPDATE_EVENT] (state, event) {
    const index = state.events.findIndex(p => p.id === event.id)
    state.events.splice(index, 1, event)
  },
  [types.DEL_EVENT] (state, event) {
    state.events.splice(state.events.indexOf(event), 1)
  },
  [types.GET_NEXT_MONTH_EVENTS] (state, payload) {
    state.events = [...payload]
  },
  [types.GET_RIGHTS] (state, rights) {
    state.rights = [...rights]
  }
}

export default { state, actions, mutations }
