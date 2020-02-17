import * as types from './mutation-types'

const state = {
  negativeId: -1
}

const getters = {
  negativeId: state => state.negativeId
}

const mutations = {
  [types.NEW_NEGATIVE_ID] (state) {
    state.negativeId--
  }
}

export default { state, getters, mutations }
