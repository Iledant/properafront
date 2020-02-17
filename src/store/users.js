import * as types from './mutation-types'
import Vue from 'vue'
import { handleRequest } from './loading.js'

const state = {
  userList: []
}

const actions = {
  [types.GET_USERS] ({ commit }, { role }) {
    return handleRequest(
      commit,
      _ => Vue.http.get(`user?role=${role}`),
      body => commit(types.GET_USERS, body.User)
    )
  },
  [types.ADD_USER] ({ commit }, { user }) {
    return handleRequest(
      commit,
      _ => Vue.http.post('user', user),
      body => commit(types.ADD_USER, body.User)
    )
  },
  [types.DEL_USER] ({ commit }, { user }) {
    return handleRequest(
      commit,
      _ => Vue.http.delete(`user/${user.id}`),
      _ => commit(types.DEL_USER, user)
    )
  },
  [types.UPDATE_USER] ({ commit }, { user }) {
    return handleRequest(
      commit,
      _ => Vue.http.put(`user/${user.id}`, user),
      body => commit(types.UPDATE_USER, body.User)
    )
  }
}

const mutations = {
  [types.ADD_USER] (state, user) {
    state.userList.push(user)
  },
  [types.DEL_USER] (state, user) {
    state.userList.splice(state.userList.indexOf(user), 1)
  },
  [types.GET_USERS] (state, ops) {
    state.userList = [...ops]
  },
  [types.UPDATE_USER] (state, user) {
    const index = state.userList.findIndex(p => p.id === user.id)
    state.userList.splice(index, 1, user)
  }
}

export default { state, actions, mutations }
