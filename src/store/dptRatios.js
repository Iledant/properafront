import * as types from './mutation-types'
import Vue from 'vue'
import { excelExport, val2F, valStyle, dateStyle } from '../components/Utils/excelExport.js'
import { handleRequest } from './loading.js'

const state = {
  opsWithDptRatios: [],
  commitmentsPerDpt: []
}

function exportDetailedCmtPerDpt (body) {
  const resp = body.DetailedFinancialCommitmentPerDpt
  const lines = resp.map(l => ({
    number: l.number,
    name: l.name,
    total: val2F(l.total),
    fc75: val2F(l.fc75),
    fc77: val2F(l.fc77),
    fc78: val2F(l.fc78),
    fc91: val2F(l.fc91),
    fc92: val2F(l.fc92),
    fc93: val2F(l.fc93),
    fc94: val2F(l.fc94),
    fc95: val2F(l.fc95)
  }))
  const columns = [
    { header: 'Numéro', key: 'number', width: 8 },
    { header: 'Nom de l\'opération', key: 'name', width: 50 },
    { header: 'Engagements totaux', key: 'total', ...valStyle },
    { header: 'Paris', key: 'fc75', ...valStyle },
    { header: 'Seine-et-Marne', key: 'fc77', ...valStyle },
    { header: 'Yvelines', key: 'fc78', ...valStyle },
    { header: 'Essonne', key: 'fc91', ...valStyle },
    { header: 'Hauts-de-Seine', key: 'fc92', ...valStyle },
    { header: 'Seine-Saint-Denis', key: 'fc93', ...valStyle },
    { header: 'Val-de-Marne', key: 'fc94', ...valStyle },
    { header: 'Val d\'Oise', key: 'fc95', ...valStyle }
  ]
  excelExport(lines, columns, 'Ratios détaillés opération départements')
}

function exportDetailedPrgPerDpt (body) {
  const resp = body.DetailedProgrammingsPerDpt
  const lines = resp.map(l => ({
    date: l.date,
    number: l.number,
    name: l.name,
    total: val2F(l.total),
    pr75: val2F(l.pr75),
    pr77: val2F(l.pr77),
    pr78: val2F(l.pr78),
    pr91: val2F(l.pr91),
    pr92: val2F(l.pr92),
    pr93: val2F(l.pr93),
    pr94: val2F(l.pr94),
    pr95: val2F(l.pr95)
  }))
  const columns = [
    { header: 'Date', key: 'date', ...dateStyle },
    { header: 'Numéro', key: 'number', width: 8 },
    { header: 'Nom de l\'opération', key: 'name', width: 50 },
    { header: 'Engagements totaux', key: 'total', ...valStyle },
    { header: 'Paris', key: 'pr75', ...valStyle },
    { header: 'Seine-et-Marne', key: 'pr77', ...valStyle },
    { header: 'Yvelines', key: 'pr78', ...valStyle },
    { header: 'Essonne', key: 'pr91', ...valStyle },
    { header: 'Hauts-de-Seine', key: 'pr92', ...valStyle },
    { header: 'Seine-Saint-Denis', key: 'pr93', ...valStyle },
    { header: 'Val-de-Marne', key: 'pr94', ...valStyle },
    { header: 'Val d\'Oise', key: 'pr95', ...valStyle }
  ]
  excelExport(lines, columns, 'Programmation département')
}

const actions = {
  async [types.GET_OPS_WITH_DPT_RATIOS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('op_dpt_ratios/ops'),
      body => {
        commit(types.GET_OPS_WITH_DPT_RATIOS, body.OpsWithDptRatios)
        commit(types.GET_PROGRAMMINGS_YEARS, body.ProgrammingsYears)
      }
    )
  },
  async [types.SET_OPERATIONS_DPT_RATIOS] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.post('op_dpt_ratios/upload', payload),
      body => commit(types.GET_OPS_WITH_DPT_RATIOS, body.OpsWithDptRatios)
    )
  },
  async [types.GET_COMMITMENTS_PER_DPT] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.get('op_dpt_ratios/financial_commitments', { params: payload }),
      body => commit(types.GET_COMMITMENTS_PER_DPT, body.FinancialCommitmentPerDpt)
    )
  },
  async [types.GET_DETAILED_COMMITMENTS_PER_DPT] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.get('op_dpt_ratios/detailed_financial_commitments',
        { params: payload }),
      body => exportDetailedCmtPerDpt(body)
    )
  },
  async [types.GET_DETAILED_PROGRAMMINGS_PER_DPT] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.get('op_dpt_ratios/detailed_programmings', { params: payload }),
      body => exportDetailedPrgPerDpt(body)

    )
  }
}

const mutations = {
  [types.GET_OPS_WITH_DPT_RATIOS] (state, ops) {
    state.opsWithDptRatios = [...ops]
  },
  [types.GET_COMMITMENTS_PER_DPT] (state, response) {
    state.commitmentsPerDpt = response
  }
}

export default { state, actions, mutations }
