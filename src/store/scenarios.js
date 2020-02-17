import * as types from './mutation-types'
import { excelExport, val2F, valStyle } from '../components/Utils/excelExport'
import Vue from 'vue'
import { handleRequest } from './loading.js'

const state = {
  scenarios: [],
  operationCrossTable: [],
  scenarioCrossTable: []
}

const actions = {
  async [types.GET_SCENARIOS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('scenarios'),
      body => commit(types.GET_SCENARIOS, body.Scenario)
    )
  },
  async [types.ADD_SCENARIO] ({ commit }, scenario) {
    return handleRequest(
      commit,
      _ => Vue.http.post('scenarios', scenario),
      body => commit(types.ADD_SCENARIO, body.Scenario)
    )
  },
  async [types.DEL_SCENARIO] ({ commit }, scenario) {
    return handleRequest(
      commit,
      _ => Vue.http.delete(`scenarios/${scenario.id}`),
      _ => commit(types.DEL_SCENARIO, scenario)
    )
  },
  async [types.UPDATE_SCENARIO] ({ commit }, scenario) {
    return handleRequest(
      commit,
      _ => Vue.http.put(`scenarios/${scenario.id}`, scenario),
      body => commit(types.UPDATE_SCENARIO, body.Scenario)
    )
  },
  async [types.GET_SCENARIO_DATA] ({ commit }, { scenarioId, firstYear }) {
    return handleRequest(
      commit,
      _ => Vue.http.get(`scenarios/${scenarioId}`, { params: { firstYear } }),
      body => commit(types.GET_SCENARIO_DATA, {
        OperationCrossTable: body.OperationCrossTable,
        ScenarioCrossTable: body.ScenarioCrossTable
      })
    )
  },
  async [types.DOWNLOAD_BUDGET_SCENARIO] (
    { commit },
    { scenarioId, firstYear }
  ) {
    return handleRequest(
      commit,
      _ => Vue.http.get(`scenarios/${scenarioId}/budget`, { params: { firstYear } }),
      body => {
        const list = body.MultiannualBudgetScenario
        if (list.length > 0) {
          const lines = list.map(({ y0, y1, y2, y3, y4, ...others }) => ({
            y0: val2F(y0),
            y1: val2F(y1),
            y2: val2F(y2),
            y3: val2F(y3),
            y4: val2F(y4),
            ...others
          }))
          const columns = [
            { header: 'Chapitre', key: 'chapter', width: 10 },
            { header: 'Secteur', key: 'sector', width: 10 },
            { header: 'Fonction', key: 'subfunction', width: 10 },
            { header: 'Programme', key: 'program', width: 10 },
            { header: 'Action', key: 'action', width: 14 },
            { header: 'Numéro d\'opération', key: 'number', width: 10 },
            { header: 'Intitulé', key: 'name', width: 50 },
            { header: String(firstYear), key: 'y0', ...valStyle },
            { header: String(firstYear + 1), key: 'y1', ...valStyle },
            { header: String(firstYear + 2), key: 'y2', ...valStyle },
            { header: String(firstYear + 3), key: 'y3', ...valStyle },
            { header: String(firstYear + 4), key: 'y4', ...valStyle }
          ]
          excelExport(lines, columns, 'Scenario par action')
        }
      }
    )
  },
  async [types.SET_SCENARIO_DATA] ({ commit }, { id, offsetList }) {
    return handleRequest(
      commit,
      _ => Vue.http.post(`scenarios/${id}/offsets`, { offsetList }),
      _ => {}
    )
  }
}

const mutations = {
  [types.ADD_SCENARIO] (state, scenario) {
    state.scenarios.push(scenario)
  },
  [types.DEL_SCENARIO] (state, scenario) {
    state.scenarios.splice(state.scenarios.indexOf(scenario), 1)
  },
  [types.GET_SCENARIOS] (state, lines) {
    state.scenarios = [...lines]
  },
  [types.UPDATE_SCENARIO] (state, scenario) {
    const index = state.scenarios.findIndex(p => p.id === scenario.id)
    state.scenarios.splice(index, 1, scenario)
  },
  [types.GET_SCENARIO_DATA] (state, payload) {
    state.operationCrossTable = [...payload.OperationCrossTable]
    state.scenarioCrossTable = [...payload.ScenarioCrossTable]
  }
}

export default { state, actions, mutations }
