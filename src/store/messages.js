import * as types from './mutation-types'
import Vue from 'vue'
import { handleRequest } from './loading.js'

const state = {
  todayMessage: null
}

const actions = {
  async [types.GET_TODAY_MESSAGE] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('today_message'),
      body => commit(types.GET_TODAY_MESSAGE, body.TodayMessage)
    )
  },
  async [types.GET_HOME_DATAS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('home'),
      body => {
        commit(types.GET_PAYMENTS_PER_MONTH, body.PaymentsPerMonth)
        commit(types.GET_MONTH_BUDGET_CREDITS, body.BudgetCredits)
        commit(types.GET_PROGRAMMINGS_PER_MONTH, body.ProgrammingsPerMonth)
        commit(types.GET_COMMITMENTS_PER_MONTH, body.FinancialCommitmentsPerMonth)
        commit(types.GET_PAYMENT_CREDITS, body.PaymentCredit)
        commit(types.GET_TODAY_MESSAGE, body.TodayMessage)
        commit(types.GET_NEXT_MONTH_EVENTS, body.Event)
        commit(types.GET_IMPORT_LOG, body.ImportLog)
        commit(types.GET_AVERAGE_PAYMENT_TIME, body.AveragePaymentTime)
        commit(types.GET_PAYMENT_DEMAND_COUNTS, body.PaymentDemandCount)
        commit(types.GET_PAYMENT_DEMANDS_STOCK, body.PaymentDemandsStock)
        commit(types.GET_CSF_WEEK_TREND, body.CsfWeekTrend)
      }
    )
  },
  async [types.SET_TODAY_MESSAGE] ({ commit }, { title, text }) {
    return handleRequest(
      commit,
      _ => Vue.http.post('today_message', { title, text }),
      body => commit(types.GET_TODAY_MESSAGE, body.TodayMessage)
    )
  }
}

const mutations = {
  [types.GET_TODAY_MESSAGE] (state, payload) {
    state.todayMessage = payload
    if (payload.text) {
      state.todayMessage.html =
        '<p>' +
        payload.text
          .replace(/\n+/g, '</p><p>')
          .replace(/(\*)([^*]+)(\*)/g, '<strong>$2</strong>') +
        '</p>'
    }
  }
}

export default { state, actions, mutations }
