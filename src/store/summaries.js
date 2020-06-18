import * as types from './mutation-types'
import Vue from 'vue'
import { excelExport, valStyle } from '../components/Utils/excelExport'
import { handleRequest } from './loading.js'

const norm4Float = l => {
  l.y0 = l.y0 ? parseFloat(l.y0) : 0
  l.y1 = l.y1 ? parseFloat(l.y1) : 0
  l.y2 = l.y2 ? parseFloat(l.y2) : 0
  l.y3 = l.y3 ? parseFloat(l.y3) : 0
}

const norm3Float = l => {
  l.y1 = l.y1 ? parseFloat(l.y1) : 0
  l.y2 = l.y2 ? parseFloat(l.y2) : 0
  l.y3 = l.y3 ? parseFloat(l.y3) : 0
}

const commonCols = [
  { header: 'Chapitre', key: 'chapter', width: 6 },
  { header: 'Secteur', key: 'sector', width: 6 },
  { header: 'Fonction', key: 'subfunction', width: 6 },
  { header: 'Programme', key: 'program', width: 7 },
  { header: 'Action', key: 'action', width: 11 },
  { header: 'Nom de l\'action', key: 'action_name', width: 50 }
]

const state = {
  progPrevisions: [],
  annualProg: [],
  multiannualProg: [],
  previsionAndRealizedList: [],
  budgetProg: [],
  PlanForecasts: []
}

const actions = {
  async [types.GET_ANNUAL_PROGRAMMATION] ({ commit }, { year }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('summaries/annual_programmation', { params: { year } }),
      body => {
        commit(types.GET_ANNUAL_PROGRAMMATION, body.AnnualProgrammation)
        commit(types.GET_IMPORT_LOG, body.ImportLog)
      }
    )
  },
  async [types.GET_INIT_ANNUAL_PROGRAMMATION] ({ commit }, { year }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('summaries/annual_programmation/init', { params: { year } }),
      body => {
        commit(types.GET_ANNUAL_PROGRAMMATION, body.AnnualProgrammation)
        commit(types.GET_IMPORT_LOG, body.ImportLog)
        commit(types.GET_PROGRAMMINGS_YEARS, body.ProgrammingsYears)
        commit(types.GET_BUDGET_CREDITS, body.BudgetCredits)
      }
    )
  },
  async [types.GET_MULTIANNUAL_PROGRAMMATION] ({ commit }, { firstYear }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('summaries/multiannual_programmation', { params: { firstYear } }),
      body => commit(types.GET_MULTIANNUAL_PROGRAMMATION, body.MultiannualProgrammation)
    )
  },
  async [types.GET_PLAN_FORECASTS] ({ commit }, { firstYear, lastYear }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('plan_forecasts', { params: { firstYear, lastYear } }),
      body => commit(types.GET_PLAN_FORECASTS, body.PlanForecast)
    )
  },
  async [types.GET_PAYMENT_PREVISION_AND_REALIZED] (
    { commit },
    { year, paymentTypeId }
  ) {
    return handleRequest(
      commit,
      _ => Vue.http.get('payments/prevision_realized', { params: { year, paymentTypeId } }),
      body => commit(types.GET_PAYMENT_PREVISION_AND_REALIZED,
        body.PaymentPrevisionAndRealized)
    )
  },
  async [types.GET_BUDGET_ACTION_PROGRAMMATION] ({ commit }, { year }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('summaries/budget_action_programmation', { params: { year } }),
      body => commit(types.GET_BUDGET_ACTION_PROGRAMMATION, body.BudgetProgrammation)
    )
  },
  async [types.GET_BUDGET_ACTION_PROGRAMMATION_AND_YEARS] ({ commit }, { year }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('summaries/budget_action_programmation_years', { params: { year } }),
      body => {
        commit(types.GET_BUDGET_ACTION_PROGRAMMATION, body.BudgetProgrammation)
        commit(types.GET_PROGRAMMINGS_YEARS, body.ProgrammingsYears)
      }
    )
  },
  async [types.GET_PROGRAMMATION_PREVISION] ({ commit }, { year }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('summaries/programmation_prevision', { params: { year } }),
      body => commit(types.GET_PROGRAMMATION_PREVISION, body.ProgrammingsPrevision)
    )
  },
  async [types.DOWNLOAD_COMMITMENT_PER_ACTION] ({ commit }, { firstYear }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('summaries/commitment_per_budget_action', { params: { firstYear } }),
      body => {
        const table = body.CommitmentPerBudgetAction
        table.forEach(l => norm4Float(l))
        const columns = [
          ...commonCols,
          { header: String(firstYear - 1), key: 'y0', ...valStyle },
          { header: String(firstYear), key: 'y1', ...valStyle },
          { header: String(firstYear + 1), key: 'y2', ...valStyle },
          { header: String(firstYear + 2), key: 'y3', ...valStyle }
        ]
        excelExport(table, columns, 'CORILOLF AP')
      }
    )
  },
  async [types.GET_PHYSICAL_OPS_FINANCIAL_COMMITMENTS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('physical_ops/financial_commitments'),
      body => {
        const table = body.PhysicalOpFinancialCommitments
        const columns = [
          { header: 'Numéro', key: 'number', width: 9 },
          { header: 'Nom d\'opération', key: 'op_name', width: 80 },
          { header: 'Code IRIS', key: 'iris_code', width: 23 },
          { header: 'Libellé IRIS', key: 'iris_name', width: 200 }
        ]
        excelExport(table, columns, 'Operation IRIS', null)
      }
    )
  },
  async [types.DOWNLOAD_DETAILED_COMMITMENT_PER_ACTION] ({ commit }, { firstYear }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('summaries/detailed_commitment_per_budget_action',
        { params: { firstYear } }),
      body => {
        const table = body.DetailedCommitmentPerBudgetAction
        table.forEach(l => norm4Float(l))
        const columns = [
          ...commonCols,
          { header: 'Numéro', key: 'number', width: 10 },
          { header: 'Nom de l\'opération', key: 'name', width: 30 },
          { header: String(firstYear - 1), key: 'y0', ...valStyle },
          { header: String(firstYear), key: 'y1', ...valStyle },
          { header: String(firstYear + 1), key: 'y2', ...valStyle },
          { header: String(firstYear + 2), key: 'y3', ...valStyle }
        ]
        excelExport(table, columns, 'CORILOLF AP OP')
      }
    )
  },
  async [types.DOWNLOAD_PAYMENT_PER_ACTION] ({ commit }, { firstYear, defaultPaymentTypeId }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('summaries/payment_per_budget_action', {
        params: {
          FirstYear: firstYear,
          DefaultPaymentTypeId: defaultPaymentTypeId
        }
      }),
      body => {
        const table = body.PaymentPerBudgetAction
        table.forEach(l => norm3Float(l))
        const columns = [
          ...commonCols,
          { header: String(firstYear), key: 'y1', ...valStyle },
          { header: String(firstYear + 1), key: 'y2', ...valStyle },
          { header: String(firstYear + 2), key: 'y3', ...valStyle }
        ]
        excelExport(table, columns, 'CORILOLF CP')
      }
    )
  },
  async [types.DOWNLOAD_STATISTICAL_PAYMENT_PER_ACTION] (
    { commit },
    { firstYear, defaultPaymentTypeId }
  ) {
    return handleRequest(
      commit,
      _ => Vue.http.get('summaries/statistical_payment_per_budget_action',
        {
          params: {
            FirstYear: firstYear,
            DefaultPaymentTypeId: defaultPaymentTypeId
          }
        }
      ),
      body => {
        const table = body.PaymentPerBudgetAction
        table.forEach(l => norm3Float(l))
        const columns = [
          ...commonCols,
          { header: String(firstYear), key: 'y1', ...valStyle },
          { header: String(firstYear + 1), key: 'y2', ...valStyle },
          { header: String(firstYear + 2), key: 'y3', ...valStyle }
        ]
        excelExport(table, columns, 'CORILOLF CP Stat')
      }
    )
  },
  async [types.DOWNLOAD_STATISTICAL_CURRENT_YEAR_PAYMENT_PER_ACTION] (
    { commit },
    { year, defaultPaymentTypeId }
  ) {
    return handleRequest(
      commit,
      _ => Vue.http.get(
        'summaries/statistical_current_year_payment_per_budget_action',
        {
          params: { Year: year, DefaultPaymentTypeId: defaultPaymentTypeId }
        }
      ),
      body => {
        const table = body.StatisticalCurrentYearPaymentPerAction
        table.forEach(l => {
          l.prev = l.prev ? parseFloat(l.prev) : 0
          l.payment = l.payment ? parseFloat(l.payment) : 0
        })
        const columns = [
          ...commonCols,
          { header: 'Statistique', key: 'prev', ...valStyle },
          { header: 'Paiements', key: 'payment', ...valStyle }
        ]
        excelExport(table, columns, 'Prévision Stat CP année')
      }
    )
  },
  async [types.DOWNLOAD_SCENARIO_PAYMENT_PER_ACTION] (
    { commit },
    { firstYear, defaultPaymentTypeId, scenarioId }
  ) {
    return handleRequest(
      commit,
      _ => Vue.http.get(`scenarios/${scenarioId}/payment_per_budget_action`,
        {
          params: {
            FirstYear: firstYear,
            DefaultPaymentTypeId: defaultPaymentTypeId
          }
        }
      ),
      body => {
        const table = body.ScenarioPaymentPerBudgetAction
        table.forEach(l => norm3Float(l))
        const columns = [
          ...commonCols,
          { header: String(firstYear), key: 'y1', ...valStyle },
          { header: String(firstYear + 1), key: 'y2', ...valStyle },
          { header: String(firstYear + 2), key: 'y3', ...valStyle }
        ]
        excelExport(table, columns, 'Scenario CP')
      }
    )
  },
  async [types.DOWNLOAD_SCENARIO_STATISTICAL_PAYMENT_PER_ACTION] (
    { commit },
    { firstYear, defaultPaymentTypeId, scenarioId }
  ) {
    return handleRequest(
      commit,
      _ => Vue.http.get(
        `scenarios/${scenarioId}/statistical_payment_per_budget_action`,
        {
          params: {
            FirstYear: firstYear,
            DefaultPaymentTypeId: defaultPaymentTypeId
          }
        }
      ),
      body => {
        const table = body.ScenarioStatisticalPaymentPerBudgetAction
        table.forEach(l => norm3Float(l))
        const columns = [
          ...commonCols,
          { header: String(firstYear), key: 'y1', ...valStyle },
          { header: String(firstYear + 1), key: 'y2', ...valStyle },
          { header: String(firstYear + 2), key: 'y3', ...valStyle }
        ]
        excelExport(table, columns, 'Scenario CP Stat')
      }
    )
  },
  async [types.DOWNLOAD_DETAILED_PAYMENT_PER_ACTION] (
    { commit },
    { firstYear, defaultPaymentTypeId }
  ) {
    return handleRequest(
      commit,
      _ => Vue.http.get(
        'summaries/detailed_payment_per_budget_action',
        {
          params: {
            FirstYear: firstYear,
            DefaultPaymentTypeId: defaultPaymentTypeId
          }
        }
      ),
      body => {
        const table = body.DetailedPaymentPerBudgetAction
        table.forEach(l => norm3Float(l))
        const columns = [
          ...commonCols,
          { header: 'Opération', key: 'name', width: 50 },
          { header: String(firstYear), key: 'y1', ...valStyle },
          { header: String(firstYear + 1), key: 'y2', ...valStyle },
          { header: String(firstYear + 2), key: 'y3', ...valStyle }
        ]
        excelExport(table, columns, 'CORILOLF CP')
      }
    )
  },
  async [types.DOWNLOAD_STATISTICAL_DETAILED_PAYMENT_PER_ACTION] (
    { commit },
    { firstYear, defaultPaymentTypeId }
  ) {
    return handleRequest(
      commit,
      _ => Vue.http.get(
        'summaries/statistical_detailed_payment_per_budget_action',
        {
          params: {
            FirstYear: firstYear,
            DefaultPaymentTypeId: defaultPaymentTypeId
          }
        }
      ),
      body => {
        const table = body.StatisticalDetailedPaymentPerBudgetAction
        table.forEach(l => norm3Float(l))
        const columns = [
          ...commonCols,
          { header: 'Opération', key: 'name', width: 50 },
          { header: String(firstYear), key: 'y1', ...valStyle },
          { header: String(firstYear + 1), key: 'y2', ...valStyle },
          { header: String(firstYear + 2), key: 'y3', ...valStyle }
        ]
        excelExport(table, columns, 'CORILOLF CP Stat')
      }
    )
  }
}

const mutations = {
  [types.GET_ANNUAL_PROGRAMMATION] (state, payload) {
    state.annualProg = [...payload]
  },
  [types.GET_PAYMENT_PREVISION_AND_REALIZED] (state, payload) {
    state.previsionAndRealizedList = [...payload]
  },
  [types.GET_MULTIANNUAL_PROGRAMMATION] (state, payload) {
    if (payload.length > 0) {
      const keys = Object.keys(payload[0])
      const yearKeys = keys.filter(k => /y\d+/.test(k))
      state.multiannualProg = payload.map(l => {
        const parsedLine = {
          name: l.name,
          number: l.number,
          step_name: l.step_name,
          category_name: l.category_name
        }
        yearKeys.forEach(yK => {
          parsedLine[yK] = JSON.parse(l[yK])
        })
        return parsedLine
      })
    } else state.multiannualProg = payload
  },
  [types.GET_PLAN_FORECASTS] (state, list) {
    state.PlanForecasts = [...list]
  },
  [types.GET_BUDGET_ACTION_PROGRAMMATION] (state, payload) {
    state.budgetProg = [...payload]
  },
  [types.GET_PROGRAMMATION_PREVISION] (state, payload) {
    state.progPrevisions = [...payload]
  }
}

export default { state, actions, mutations }
