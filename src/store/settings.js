import * as types from './mutation-types'
import Vue from 'vue'
import { handleRequest } from './loading.js'

const actions = {
  async [types.GET_SETTINGS_DATA] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('settings'),
      body => {
        commit(types.GET_BENEFICIARIES, body.Beneficiary)
        commit(types.GET_BUDGET_CHAPTERS, body.BudgetChapter)
        commit(types.GET_BUDGET_SECTORS, body.BudgetSector)
        commit(types.GET_BUDGET_PROGRAMS, body.BudgetProgram)
        commit(types.GET_BUDGET_ACTIONS, body.BudgetAction)
        commit(types.GET_COMMISSIONS, body.Commissions)
        commit(types.GET_PHYSICAL_OPS, body.PhysicalOp)
        commit(types.GET_PAYMENT_TYPES, body.PaymentType)
        commit(types.GET_PLANS, body.Plan)
        commit(types.GET_BUDGET_CREDITS, body.BudgetCredits)
        commit(
          types.GET_UNLINKED_PENDING_COMMITMENTS,
          body.UnlinkedPendingCommitments
        )
        commit(
          types.GET_LINKED_PENDING_COMMITMENTS,
          body.LinkedPendingCommitments
        )
        commit(types.GET_STEPS, body.Step)
        commit(types.GET_CATEGORIES, body.Category)
      }
    )
  }
}

export default { actions }
