import * as types from './mutation-types'
import Vue from 'vue'
import { handleRequest } from './loading.js'
import { excelExport, val2F, dateStyle, valStyle } from '../components/Utils/excelExport'

const state = {
  fcList: [],
  fcPerMonthList: [],
  programmingsPerMonthList: [],
  fcOpUnlinkedList: [],
  fcOpUnlinkedCurrentPageNumber: 1,
  fcOpUnlinkedItemsCount: 0,
  fcPlUnlinkedList: [],
  fcPlUnlinkedCurrentPageNumber: 1,
  fcPlUnlinkedItemsCount: 1,
  paymentList: [],
  paymentsPerMonthList: [],
  allPaymentsPerMonthList: [],
  beneficiaryPaymentsChronicles: [],
  prevPaymentList: [],
  prevCommitmentList: [],
  fcPerBeneficiary: [],
  paymentPerBeneficiary: [],
  fcOpLinkedList: [],
  fcOpLinkedCurrentPageNumber: 1,
  fcOpLinkedItemsCount: 0,
  fcPlLinkedList: [],
  fcPlLinkedCurrentPageNumber: 1,
  fcPlLinkedItemsCount: 0,
  pendingsList: [],
  opPendingCommitment: 0,
  unlinkedPendingsList: [],
  linkedPendingsList: [],
  paymentCredits: [],
  paymentCreditJournal: [],
  paymentNeeds: [],
  needsAndForecasts: [],
  paymentPrevisions: [],
  actionPaymentPrevisions: [],
  multiannualDifPmtPrev: [],
  curYearActionPmtPrevisions: []
}

const actions = {
  async [types.GET_UNLINKED_FINANCIAL_COMMITMENTS] (
    { commit },
    { page, search, LinkType, minYear }
  ) {
    return handleRequest(
      commit,
      _ => Vue.http.get(
        `financial_commitments?page=${page}&search=${search}&LinkType=${LinkType}&MinYear=${minYear}`),
      body => {
        const action = LinkType === 'PhysicalOp'
          ? types.SET_FC_OP_UNLINKED
          : types.SET_FC_PL_UNLINKED
        commit(action, body)
      }
    )
  },
  async [types.GET_PENDING_COMMITMENTS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('pending_commitments/'),
      body => commit(types.GET_PENDING_COMMITMENTS, body.PendingCommitments)
    )
  },
  async [types.GET_UNLINKED_PENDING_COMMITMENTS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('pending_commitments/unlinked'),
      body => commit(types.GET_UNLINKED_PENDING_COMMITMENTS, body.UnlinkedPendingCommitments)
    )
  },
  async [types.GET_LINKED_PENDING_COMMITMENTS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('pending_commitments/linked'),
      body => commit(types.GET_LINKED_PENDING_COMMITMENTS, body.PendingCommitments)
    )
  },
  async [types.GET_OP_PENDING_COMMITMENTS_DATAS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('pending_commitments/ops'),
      body => {
        commit(types.GET_UNLINKED_PENDING_COMMITMENTS, body.UnlinkedPendingCommitments)
        commit(types.GET_LINKED_PENDING_COMMITMENTS, body.PendingCommitments)
        commit(types.GET_PHYSICAL_OPS, body.PhysicalOp)
      }
    )
  },
  async [types.LINK_PENDING_COMMITMENTS] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.post(`pending_commitments/physical_ops/${payload.opId}`, payload),
      body => commit(types.GET_UNLINKED_PENDING_COMMITMENTS, body.UnlinkedPendingCommitments)
    )
  },
  async [types.UNLINK_PENDINGS_LIST] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.post('pending_commitments/unlink', payload),
      body => commit(types.GET_LINKED_PENDING_COMMITMENTS, body.PendingCommitments)
    )
  },
  async [types.LINK_FINANCIAL_COMMITMENTS] (
    { commit },
    { opId, fcIdList, search, minYear }
  ) {
    return handleRequest(
      commit,
      _ => Vue.http.post(`financial_commitments/physical_ops/${opId}`,
        { fcIdList, search, MinYear: minYear }),
      body => commit(types.SET_FC_OP_UNLINKED, body)
    )
  },
  async [types.LINK_FINANCIAL_COMMITMENTS_PL] (
    { commit },
    { plId, fcIdList, search, minYear }
  ) {
    return handleRequest(
      commit,
      _ => Vue.http.post(`financial_commitments/plan_lines/${plId}`,
        { fcIdList, search, MinYear: minYear }),
      body => commit(types.SET_FC_PL_UNLINKED, body)
    )
  },
  async [types.GET_PREVISIONS] ({ commit }, { id }) {
    return handleRequest(
      commit,
      _ => Vue.http.get(`physical_ops/${id}/previsions`),
      body => {
        commit(types.ADD_PREVCOMMITMENTS, body.PrevCommitment)
        commit(types.ADD_PREV_PAYMENTS, body.PrevPayment)
        commit(types.GET_FINANCIAL_COMMITMENTS, body.FinancialCommitment)
        commit(types.GET_PAYMENTS, body.Payment)
        commit(
          types.SET_FC_PER_BENEFICIARY,
          body.FinancialCommitmentPerBeneficiary
        )
        commit(types.SET_PAYMENT_PER_BENEFICIARY, body.PaymentPerBeneficiary)
        commit(types.SET_OP_PENDING_COMMITMENT, body.PendingCommitment)
        commit(types.GET_IMPORT_LOG, body.ImportLog)
        commit(types.GET_EVENTS, body.Event)
        commit(types.GET_PAYMENT_TYPES, body.PaymentType)
        commit(types.GET_DOCUMENTS, body.Document)
      }
    )
  },
  async [types.GET_ONLY_PREVISIONS] ({ commit }, { id }) {
    return handleRequest(
      commit,
      _ => Vue.http.get(`physical_ops/${id}/only_previsions`),
      body => {
        commit(types.ADD_PREVCOMMITMENTS, body.PrevCommitment)
        commit(types.ADD_PREV_PAYMENTS, body.PrevPayment)
      }
    )
  },
  async [types.GET_PAYMENTS_PER_MONTH] ({ commit }, { year }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('payments/month', { params: { year } }),
      body => commit(types.GET_PAYMENTS_PER_MONTH, body.PaymentsPerMonth)
    )
  },
  async [types.GET_PAYMENT_DATAS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('payments'),
      body => {
        commit(types.GET_PAYMENTS_PER_MONTH, body.PaymentsPerMonth)
        commit(types.GET_ALL_PAYMENTS_PER_MONTH, body.MonthCumulatedPayment)
        commit(types.GET_BENEFICIARIES, body.Beneficiary)
        commit(types.GET_PAYMENT_TYPES, body.PaymentType)
        commit(types.GET_PAYMENT_CREDIT_JOURNAL, body.PaymentCreditJournal)
        commit(types.GET_PAYMENT_CREDITS, body.PaymentCredit)
        commit(types.GET_PAYMENT_NEEDS, body.PaymentNeed)
      }
    )
  },
  async [types.GET_ALL_PAYMENTS_PER_MONTH] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('payments/month_cumulated'),
      body => commit(types.GET_ALL_PAYMENTS_PER_MONTH, body.MonthCumulatedPayment)
    )
  },
  async [types.GET_BEN_PMT_CHRONICLES] ({ commit }, { beneficiaryId }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('payments/month_cumulated', { params: { beneficiaryId } }),
      body => commit(types.GET_BEN_PMT_CHRONICLES, body.MonthCumulatedPayment)
    )
  },
  async [types.GET_COMMITMENTS_PER_MONTH] ({ commit }, { year }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('financial_commitments/month', { params: { year } }),
      body => {
        commit(types.GET_BUDGET_CREDITS, body.BudgetCredits)
        commit(types.GET_PROGRAMMINGS_PER_MONTH, body.ProgrammingsPerMonth)
        commit(types.GET_COMMITMENTS_PER_MONTH, body.FinancialCommitmentsPerMonth)
      }
    )
  },
  async [types.SET_PREVISIONS] ({ commit }, { id, PrevCommitment, PrevPayment }) {
    return handleRequest(
      commit,
      _ => Vue.http.post(`physical_ops/${id}/previsions`, { PrevCommitment, PrevPayment }),
      body => {
        commit(types.ADD_PREVCOMMITMENTS, body.PrevCommitment)
        commit(types.ADD_PREV_PAYMENTS, body.PrevPayment)
      }
    )
  },
  async [types.GET_FC_LINKED] ({ commit }, { page, search, LinkType, minYear }) {
    return handleRequest(
      commit,
      _ => Vue.http.get(
        `financial_commitments/linked?page=${page}&search=${search}&LinkType=${LinkType}&MinYear=${minYear}`),
      body => {
        const action = LinkType === 'PhysicalOp'
          ? types.GET_FC_OP_LINKED
          : types.GET_FC_PL_LINKED
        commit(action, body)
      }
    )
  },
  async [types.UNLINK_FC_LIST] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.post('financial_commitments/unlink', payload),
      body => {
        if (payload.linkType === 'PhysicalOp') {
          commit(types.GET_FC_OP_LINKED, body)
        } else {
          commit(types.GET_FC_PL_LINKED, body)
        }
      }
    )
  },
  async [types.DELETE_PAYMENT_NEED] ({ commit }, ID) {
    return handleRequest(
      commit,
      _ => Vue.http.delete(`payment_need/${ID}`, ID),
      _ => commit(types.DELETE_PAYMENT_NEED, ID)
    )
  },
  async [types.CREATE_PAYMENT_NEED] ({ commit }, { PaymentNeed }) {
    return handleRequest(
      commit,
      _ => Vue.http.post('payment_need', { PaymentNeed }),
      body => commit(types.CREATE_PAYMENT_NEED, body.PaymentNeed)
    )
  },
  async [types.UPDATE_PAYMENT_NEED] ({ commit }, { PaymentNeed }) {
    return handleRequest(
      commit,
      _ => Vue.http.put('payment_need', { PaymentNeed }),
      body => commit(types.UPDATE_PAYMENT_NEED, body.PaymentNeed)
    )
  },
  async [types.GET_PAYMENT_NEEDS_AND_FORECAST] ({ commit }, { Year, PaymentTypeID }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('payment_needs/forecast', { params: { Year, PaymentTypeID } }),
      body => commit(types.GET_PAYMENT_NEEDS_AND_FORECAST, body.PaymentNeed)
    )
  },
  async [types.DOWNLOAD_ALL_PL_UNLINKED_COMMITMENTS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('financial_commitments/unlinked'),
      body => {
        const lines = body.FinancialCommitment.map(({ date, value, ...others }) =>
          ({
            value: val2F(value),
            date: new Date(date),
            ...others
          }))
        const columns = [
          { header: 'Date', key: 'date', ...dateStyle },
          { header: 'Code IRIS', key: 'iris_code', width: 20 },
          { header: 'Nom fiche', key: 'name', width: 50 },
          { header: 'Bénéficiaire', key: 'beneficiary', width: 50 },
          { header: 'Montant', key: 'value', ...valStyle }
        ]
        excelExport(lines, columns, 'Engagements non lies')
      }
    )
  },
  async [types.GET_PAYMENT_PREVISION] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('payment_previsions'),
      body => commit(types.GET_PAYMENT_PREVISION, body)
    )
  },
  async [types.GET_ACTION_PAYMENT_PREVISION] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('payment_previsions/actions'),
      body => commit(types.GET_ACTION_PAYMENT_PREVISION, body.DifActionPmtPrevision)
    )
  },
  async [types.GET_CUR_YEAR_ACTION_PMT_PREV] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('payment_previsions/current_year'),
      body => commit(types.GET_CUR_YEAR_ACTION_PMT_PREV, body.CurYearActionPmtPrevision)
    )
  }
}

const mutations = {
  [types.SET_FC_OP_UNLINKED] (state, payload) {
    state.fcOpUnlinkedList = [...payload.FinancialCommitment]
    state.fcOpUnlinkedCurrentPageNumber = payload.current_page
    state.fcOpUnlinkedItemsCount = payload.items_count
  },
  [types.SET_FC_PL_UNLINKED] (state, payload) {
    state.fcPlUnlinkedList = [...payload.FinancialCommitment]
    state.fcPlUnlinkedCurrentPageNumber = payload.current_page
    state.fcPlUnlinkedItemsCount = payload.items_count
  },
  [types.GET_FINANCIAL_COMMITMENTS] (state, fcs) {
    state.fcList = [...fcs]
  },
  [types.GET_COMMITMENTS_PER_MONTH] (state, list) {
    state.fcPerMonthList = [...list]
  },
  [types.GET_PAYMENTS] (state, payments) {
    state.paymentList = [...payments]
  },
  [types.SET_ERROR_MESSAGE] (state, message) {
    state.fcErrorMessage = message
  },
  [types.GET_FC_OP_LINKED] (state, payload) {
    state.fcOpLinkedList = [...payload.FinancialCommitment]
    state.fcOpLinkedCurrentPageNumber = payload.current_page
    state.fcOpLinkedItemsCount = payload.items_count
  },
  [types.GET_FC_PL_LINKED] (state, payload) {
    state.fcPlLinkedList = [...payload.FinancialCommitment]
    state.fcPlLinkedCurrentPageNumber = payload.current_page
    state.fcPlLinkedItemsCount = payload.items_count
  },
  [types.ADD_PREVCOMMITMENTS] (state, commitments) {
    state.prevCommitmentList = [...commitments]
  },
  [types.ADD_PREV_PAYMENTS] (state, payments) {
    state.prevPaymentList = [...payments]
  },
  [types.ADD_MODIFIED_COMMITMENTS] (state, commitmentList) {
    commitmentList.forEach(c => {
      if (c.id) {
        const m = state.prevCommitmentList.find(p => p.id === c.id)
        m.value = c.value
      } else state.prevCommitmentList.push(c)
    })
  },
  [types.ADD_MODIFIED_PAYMENTS] (state, paymentList) {
    paymentList.forEach(c => {
      if (c.id) {
        const m = state.prevPaymentList.find(p => p.id === c.id)
        m.value = c.value
      } else state.prevPaymentList.push(c)
    })
  },
  [types.SET_ERROR_MESSAGE] (state, message) {
    state.previsionsErrorMessage = message
  },
  [types.LINK_FINANCIAL_COMMITMENTS] (state, fcIdList) {
    fcIdList.forEach(f => {
      state.fcList.splice(state.fcList.indexOf(f), 1)
    })
  },
  [types.SET_FC_PER_BENEFICIARY] (state, payload) {
    state.fcPerBeneficiary = payload
  },
  [types.SET_PAYMENT_PER_BENEFICIARY] (state, payload) {
    state.paymentPerBeneficiary = payload
  },
  [types.SET_OP_PENDING_COMMITMENT] (state, payload) {
    state.opPendingCommitment = Number(payload[0].value || 0)
  },
  [types.GET_PENDING_COMMITMENTS] (state, pendingCommitments) {
    state.pendingsList = [...pendingCommitments]
  },
  [types.GET_UNLINKED_PENDING_COMMITMENTS] (state, pendingCommitments) {
    state.unlinkedPendingsList = [...pendingCommitments]
  },
  [types.GET_LINKED_PENDING_COMMITMENTS] (state, pendingCommitments) {
    state.linkedPendingsList = [...pendingCommitments]
  },
  [types.GET_PAYMENTS_PER_MONTH] (state, list) {
    state.paymentsPerMonthList = [...list]
  },
  [types.GET_ALL_PAYMENTS_PER_MONTH] (state, list) {
    state.allPaymentsPerMonthList = [...list]
  },
  [types.GET_BEN_PMT_CHRONICLES] (state, list) {
    state.beneficiaryPaymentsChronicles = [...list]
  },
  [types.GET_PROGRAMMINGS_PER_MONTH] (state, list) {
    state.programmingsPerMonthList = [...list]
  },
  [types.GET_PAYMENT_CREDITS] (state, list) {
    state.paymentCredits = [...list]
  },
  [types.GET_PAYMENT_CREDIT_JOURNAL] (state, list) {
    state.paymentCreditJournal = [...list]
  },
  [types.GET_PAYMENT_NEEDS] (state, list) {
    state.paymentNeeds = [...list]
  },
  [types.DELETE_PAYMENT_NEED] (state, ID) {
    const index = state.paymentNeeds.findIndex(p => p.ID === ID)
    state.paymentNeeds.splice(index, 1)
  },
  [types.CREATE_PAYMENT_NEED] (state, payload) {
    state.paymentNeeds.push(payload)
  },
  [types.UPDATE_PAYMENT_NEED] (state, payload) {
    const index = state.paymentNeeds.findIndex(p => p.ID === payload.ID)
    state.paymentNeeds.splice(index, 1, payload)
  },
  [types.GET_PAYMENT_NEEDS_AND_FORECAST] (state, list) {
    state.needsAndForecasts = [...list]
  },
  [types.GET_PAYMENT_PREVISION] (state, payload) {
    state.paymentPrevisions = []
    payload.PmtPrevision.forEach(p => {
      const d = payload.DifPmtPrevision.find(i => i.year === p.year)
      state.paymentPrevisions.push({
        year: p.year,
        pmtMin: p.min,
        pmtMax: p.max,
        difPmt: d ? d.prev : null
      })
    })
  },
  [types.GET_ACTION_PAYMENT_PREVISION] (state, list) {
    state.actionPaymentPrevisions = [...list]
  },
  [types.GET_CUR_YEAR_ACTION_PMT_PREV] (state, list) {
    state.curYearActionPmtPrevisions = [...list]
  }
}

export default { state, actions, mutations }
