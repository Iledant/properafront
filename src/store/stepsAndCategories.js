import * as types from './mutation-types'
import Vue from 'vue'
import { handleRequest } from './loading.js'

const state = {
  steps: [],
  categories: []
}

const actions = {
  async [types.GET_STEPS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('steps'),
      body => commit(types.GET_STEPS, body.Step)
    )
  },
  async [types.GET_STEPS_AND_CATEGORIES] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('steps_categories'),
      body => {
        commit(types.GET_STEPS, body.Step)
        commit(types.GET_CATEGORIES, body.Category)
      }
    )
  },
  async [types.ADD_STEP] ({ commit }, { Step }) {
    return handleRequest(
      commit,
      _ => Vue.http.post('steps', Step),
      body => commit(types.ADD_STEP, body.Step)
    )
  },
  async [types.DEL_STEP] ({ commit }, { Step }) {
    return handleRequest(
      commit,
      _ => Vue.http.delete(`steps/${Step.id}`),
      _ => commit(types.DEL_STEP, Step)
    )
  },
  async [types.UPDATE_STEP] ({ commit }, { Step }) {
    return handleRequest(
      commit,
      _ => Vue.http.put(`steps/${Step.id}`, Step),
      body => commit(types.UPDATE_STEP, body.Step)
    )
  },
  async [types.GET_CATEGORIES] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('categories'),
      body => commit(types.GET_CATEGORIES, body.Category)
    )
  },
  async [types.ADD_CATEGORY] ({ commit }, { Category }) {
    return handleRequest(
      commit,
      _ => Vue.http.post('categories', Category),
      body => commit(types.ADD_CATEGORY, body.Category)
    )
  },
  async [types.DEL_CATEGORY] ({ commit }, { Category }) {
    return handleRequest(
      commit,
      _ => Vue.http.delete(`categories/${Category.id}`),
      _ => commit(types.DEL_CATEGORY, Category)
    )
  },
  async [types.UPDATE_CATEGORY] ({ commit }, { Category }) {
    return handleRequest(
      commit,
      _ => Vue.http.put(`categories/${Category.id}`, Category),
      body => commit(types.UPDATE_CATEGORY, body.Category)
    )
  }
}

const mutations = {
  [types.ADD_STEP] (state, step) {
    state.steps.push(step)
  },
  [types.DEL_STEP] (state, step) {
    state.steps.splice(state.steps.indexOf(step), 1)
  },
  [types.UPDATE_STEP] (state, step) {
    const index = state.steps.findIndex(p => p.id === step.id)
    state.steps.splice(index, 1, step)
  },
  [types.GET_STEPS] (state, steps) {
    state.steps = [...steps]
  },
  [types.ADD_CATEGORY] (state, category) {
    state.categories.push(category)
  },
  [types.DEL_CATEGORY] (state, category) {
    state.categories.splice(state.categories.indexOf(category), 1)
  },
  [types.UPDATE_CATEGORY] (state, category) {
    const index = state.categories.findIndex(p => p.id === category.id)
    state.categories.splice(index, 1, category)
  },
  [types.GET_CATEGORIES] (state, categories) {
    state.categories = [...categories]
  }
}

export default { state, actions, mutations }
