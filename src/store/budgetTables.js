import * as types from './mutation-types'
import Vue from 'vue'
import { handleRequest } from './loading.js'

const state = {
  chapterList: [],
  sectorList: [],
  programList: [],
  actionList: [],
  creditsList: [],
  monthCreditsList: []
}

const actions = {
  async [types.GET_BUDGET_CHAPTERS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('budget_chapters'),
      body => commit(types.GET_BUDGET_CHAPTERS, body.BudgetChapter)
    )
  },
  async [types.ADD_BUDGET_CHAPTER] ({ commit }, { BudgetChapter }) {
    return handleRequest(
      commit,
      _ => Vue.http.post('budget_chapters', BudgetChapter),
      body => commit(types.ADD_BUDGET_CHAPTER, body.BudgetChapter)
    )
  },
  async [types.DEL_BUDGET_CHAPTER] ({ commit }, { BudgetChapter }) {
    return handleRequest(
      commit,
      _ => Vue.http.delete(`budget_chapters/${BudgetChapter.id}`),
      _ => commit(types.DEL_BUDGET_CHAPTER, BudgetChapter)
    )
  },
  async [types.UPDATE_BUDGET_CHAPTER] ({ commit }, { BudgetChapter }) {
    return handleRequest(
      commit,
      _ => Vue.http.put(`budget_chapters/${BudgetChapter.id}`, BudgetChapter),
      body => commit(types.UPDATE_BUDGET_CHAPTER, body.BudgetChapter)
    )
  },
  async [types.GET_BUDGET_SECTORS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('budget_sectors'),
      body => commit(types.GET_BUDGET_SECTORS, body.BudgetSector)
    )
  },
  async [types.ADD_BUDGET_SECTOR] ({ commit }, { BudgetSector }) {
    return handleRequest(
      commit,
      _ => Vue.http.post('budget_sectors', BudgetSector),
      body => commit(types.ADD_BUDGET_SECTOR, body.BudgetSector)
    )
  },
  async [types.DEL_BUDGET_SECTOR] ({ commit }, { BudgetSector }) {
    return handleRequest(
      commit,
      _ => Vue.http.delete(`budget_sectors/${BudgetSector.id}`),
      _ => commit(types.DEL_BUDGET_SECTOR, BudgetSector)
    )
  },
  async [types.UPDATE_BUDGET_SECTOR] ({ commit }, { BudgetSector }) {
    return handleRequest(
      commit,
      _ => Vue.http.put(`budget_sectors/${BudgetSector.id}`, BudgetSector),
      body => commit(types.UPDATE_BUDGET_SECTOR, body.BudgetSector)
    )
  },
  async [types.GET_BUDGET_PROGRAMS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('budget_programs'),
      body => commit(types.GET_BUDGET_PROGRAMS, body.BudgetProgram)
    )
  },
  async [types.ADD_BUDGET_PROGRAM] ({ commit }, { BudgetProgram }) {
    return handleRequest(
      commit,
      _ => Vue.http.post(`budget_chapters/${BudgetProgram.chapter_id}/programs`,
        BudgetProgram),
      body => commit(types.ADD_BUDGET_PROGRAM, body.BudgetProgram)
    )
  },
  async [types.DEL_BUDGET_PROGRAM] ({ commit }, { BudgetProgram }) {
    return handleRequest(
      commit,
      _ => Vue.http.delete(
        `budget_chapters/${BudgetProgram.chapter_id}/programs/${BudgetProgram.id}`),
      _ => commit(types.DEL_BUDGET_PROGRAM, BudgetProgram)
    )
  },
  async [types.UPDATE_BUDGET_PROGRAM] ({ commit }, { BudgetProgram }) {
    return handleRequest(
      commit,
      _ => Vue.http.put(
        `budget_chapters/${BudgetProgram.chapter_id}/programs/${BudgetProgram.id}`,
        BudgetProgram),
      body => commit(types.UPDATE_BUDGET_PROGRAM, body.BudgetProgram)
    )
  },
  async [types.GET_BUDGET_ACTIONS] ({ commit }, payload = null) {
    return handleRequest(
      commit,
      _ => Vue.http.get('budget_actions', { params: payload }),
      body => commit(types.GET_BUDGET_ACTIONS, body.BudgetAction)
    )
  },
  async [types.ADD_BUDGET_ACTION] ({ commit }, { BudgetAction }) {
    return handleRequest(
      commit,
      _ => Vue.http.post(`budget_chapters/${BudgetAction.chapter_id}/programs/${
        BudgetAction.program_id}/actions`, BudgetAction),
      body => commit(types.ADD_BUDGET_ACTION, body.BudgetAction)
    )
  },
  async [types.DEL_BUDGET_ACTION] ({ commit }, { BudgetAction }) {
    return handleRequest(
      commit,
      _ => Vue.http.delete(
        `budget_chapters/${BudgetAction.chapter_id}/programs/${
          BudgetAction.program_id}/actions/${BudgetAction.id}`),
      _ => commit(types.DEL_BUDGET_ACTION, BudgetAction)
    )
  },
  async [types.UPDATE_BUDGET_ACTION] ({ commit }, { BudgetAction }) {
    return handleRequest(
      commit,
      _ => Vue.http.put(`budget_chapters/${BudgetAction.chapter_id}/programs/${
        BudgetAction.program_id}/actions/${BudgetAction.id}`, BudgetAction),
      body => commit(types.UPDATE_BUDGET_ACTION, body.BudgetAction)
    )
  },
  async [types.ADD_BUDGET_ACTIONS] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.post('budget_actions', payload),
      null
    )
  },
  async [types.ADD_BUDGET_PROGRAMS] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.post('budget_programs', payload),
      null
    )
  },
  async [types.ADD_BUDGET_CREDIT] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.post('budget_credits', payload),
      body => commit(types.ADD_BUDGET_CREDIT, body.BudgetCredits)
    )
  },
  async [types.UPDATE_BUDGET_CREDIT] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.put(`budget_credits/${payload.id}`, payload),
      body => commit(types.UPDATE_BUDGET_CREDIT, body.BudgetCredits)
    )
  },
  async [types.ADD_BUDGET_CREDITS] ({ commit }, payload) {
    return handleRequest(
      commit,
      _ => Vue.http.post('budget_credits/array', payload),
      null
    )
  },
  async [types.GET_BUDGET_CREDITS] ({ commit, params }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('budget_credits/year', { params }),
      body => commit(types.GET_BUDGET_CREDITS, body.BudgetCredits)
    )
  },
  async [types.GET_ALL_BUDGET_CREDITS] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('budget_credits'),
      body => {
        commit(types.GET_BUDGET_CREDITS, body.BudgetCredits)
        commit(types.GET_BUDGET_CHAPTERS, body.BudgetChapter)
      }
    )
  },
  async [types.GET_BUDGET_TABLES] ({ commit }) {
    return handleRequest(
      commit,
      _ => Vue.http.get('budget_tables'),
      body => {
        commit(types.GET_BUDGET_CHAPTERS, body.BudgetChapter)
        commit(types.GET_BUDGET_PROGRAMS, body.BudgetProgram)
        commit(types.GET_BUDGET_SECTORS, body.BudgetSector)
        commit(types.GET_BUDGET_ACTIONS, body.BudgetAction)
      }
    )
  }
}

const mutations = {
  [types.ADD_BUDGET_CHAPTER] (state, { code, ...others }) {
    state.chapterList.push({ code: String(code), ...others })
  },
  [types.DEL_BUDGET_CHAPTER] (state, chapter) {
    state.chapterList.splice(state.chapterList.indexOf(chapter), 1)
  },
  [types.GET_BUDGET_CHAPTERS] (state, chapters) {
    state.chapterList = chapters.map(({ code, ...others }) => ({
      code: String(code),
      ...others
    }))
  },
  [types.UPDATE_BUDGET_CHAPTER] (state, { code, id, ...others }) {
    const index = state.chapterList.findIndex(p => p.id === id)
    state.chapterList.splice(index, 1, { code: String(code), id, ...others })
  },
  [types.ADD_BUDGET_SECTOR] (state, sector) {
    state.sectorList.push(sector)
  },
  [types.DEL_BUDGET_SECTOR] (state, sector) {
    state.sectorList.splice(state.sectorList.indexOf(sector), 1)
  },
  [types.GET_BUDGET_SECTORS] (state, sectors) {
    state.sectorList = [...sectors]
  },
  [types.UPDATE_BUDGET_SECTOR] (state, sector) {
    const index = state.sectorList.findIndex(p => p.id === sector.id)
    state.sectorList.splice(index, 1, sector)
  },
  [types.ADD_BUDGET_PROGRAM] (state, program) {
    state.programList.push(program)
  },
  [types.DEL_BUDGET_PROGRAM] (state, program) {
    state.programList.splice(state.programList.indexOf(program), 1)
  },
  [types.GET_BUDGET_PROGRAMS] (state, programs) {
    state.programList = [...programs]
  },
  [types.UPDATE_BUDGET_PROGRAM] (state, program) {
    const index = state.programList.findIndex(p => p.id === program.id)
    state.programList.splice(index, 1, program)
  },
  [types.ADD_BUDGET_ACTION] (state, action) {
    state.actionList.push(action)
  },
  [types.DEL_BUDGET_ACTION] (state, action) {
    state.actionList.splice(state.actionList.indexOf(action), 1)
  },
  [types.GET_BUDGET_ACTIONS] (state, actions) {
    state.actionList = [...actions]
  },
  [types.UPDATE_BUDGET_ACTION] (state, action) {
    const index = state.actionList.findIndex(p => p.id === action.id)
    state.actionList.splice(index, 1, action)
  },
  [types.GET_BUDGET_CREDITS] (state, credits) {
    state.creditsList = credits.map(({ commission_date: date, ...others }) => ({
      commission_date: date.substr(0, 10),
      ...others
    }))
  },
  [types.ADD_BUDGET_CREDIT] (state, { commission_date: date, ...others }) {
    state.creditsList.push({
      commission_date: date.substr(0, 10),
      ...others
    })
  },
  [types.UPDATE_BUDGET_CREDIT] (state, credit) {
    const index = state.creditsList.findIndex(p => p.id === credit.id)
    state.creditsList.splice(index, 1, credit)
  },
  [types.GET_MONTH_BUDGET_CREDITS] (state, payload) {
    state.monthCreditsList = [...payload]
  }
}

export default { state, actions, mutations }
