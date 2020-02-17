import * as types from './mutation-types'
import Vue from 'vue'
import { handleRequest } from './loading.js'

const state = {
  documents: []
}

const actions = {
  async [types.GET_DOCUMENTS] ({ commit }, { id }) {
    handleRequest(
      commit,
      _ => Vue.http.get(`physical_ops/${id}/documents`),
      body => commit(types.GET_DOCUMENTS, body.Document)
    )
  },
  async [types.ADD_DOCUMENT] ({ commit }, { id, document }) {
    handleRequest(
      commit,
      _ => Vue.http.post(`physical_ops/${id}/documents`, document),
      body => commit(types.ADD_DOCUMENT, body.Document)
    )
  },
  async [types.DEL_DOCUMENT] ({ commit }, { id, document }) {
    handleRequest(
      commit,
      _ => Vue.http.delete(`physical_ops/${id}/documents/${document.id}`),
      _ => commit(types.DEL_DOCUMENT, document)
    )
  },
  async [types.UPDATE_DOCUMENT] ({ commit }, { id, document }) {
    handleRequest(
      commit,
      _ => Vue.http.put(`physical_ops/${id}/documents/${document.id}`, document),
      body => commit(types.UPDATE_DOCUMENT, body.Document)
    )
  }
}

const mutations = {
  [types.ADD_DOCUMENT] (state, document) {
    state.documents.push(document)
  },
  [types.DEL_DOCUMENT] (state, document) {
    state.documents.splice(state.documents.indexOf(document), 1)
  },
  [types.GET_DOCUMENTS] (state, docs) {
    state.documents = [...docs]
  },
  [types.UPDATE_DOCUMENT] (state, document) {
    const index = state.documents.findIndex(p => p.id === document.id)
    state.documents.splice(index, 1, document)
  }
}

export default { state, actions, mutations }
