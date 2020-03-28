import * as types from './mutation-types'

export function beginLoading (commit) {
  commit(types.BEGIN_LOADING)
  commit(types.SET_ERROR_MESSAGE, null)
}

export function setErrorMessage (commit, response) {
  let msg = 'Impossible de récupérer les données'
  if (response && response.body && response.body.error) {
    // console.error(response.body.error)
    if (response.status === 400 &&
      response.body.error === 'Erreur de login ou de mot de passe') {
      msg = 'Erreur de login ou de mot de passe'
    }
  }
  commit(types.SET_ERROR_MESSAGE, msg)
  commit(types.END_LOADING)
}

export async function handleRequest (commit, fetchFunc, handleResp) {
  beginLoading(commit)
  try {
    const { body } = await fetchFunc()
    if (typeof handleResp === 'function') {
      handleResp(body)
    }
  } catch (err) {
    console.log(err)
    setErrorMessage(commit, err)
  } finally {
    commit(types.END_LOADING)
  }
}

const state = {
  loading: 0,
  errorMsg: ''
}

const getters = {
  loading: state => state.loading !== 0,
  errorMsg: state => state.errorMsg
}

const mutations = {
  [types.BEGIN_LOADING] (state) {
    state.loading++
  },
  [types.END_LOADING] (state) {
    if (state.loading > 0) state.loading--
  },
  [types.SET_ERROR_MESSAGE] (state, payload) {
    state.errorMsg = payload
  }
}

export default { state, getters, mutations }
