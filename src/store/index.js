import Vue from 'vue'
import Vuex from 'vuex'
import physops from './physops'
import plans from './plans'
import planLines from './planLines'
import users from './users'
import ids from './ids'
import token from './token'
import uploads from './uploads'
import previsions from './previsions'
import summaries from './summaries'
import scenarios from './scenarios'
import documents from './documents'
import beneficiaries from './beneficiaries'
import budgetTables from './budgetTables'
import programmings from './programmings'
import preProgrammings from './preProgrammings'
import messages from './messages'
import paymentRatios from './paymentRatios'
import loading from './loading'
import importLog from './importLog'
import settings from './settings'
import stepsAndCategories from './stepsAndCategories'
import dptRatios from './dptRatios'
import consistency from './consistency'
import paymentDemands from './paymentDemands'
import paymentDelays from './paymentDelays'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    physops,
    plans,
    planLines,
    users,
    ids,
    token,
    uploads,
    previsions,
    summaries,
    scenarios,
    documents,
    beneficiaries,
    budgetTables,
    programmings,
    preProgrammings,
    messages,
    paymentRatios,
    loading,
    importLog,
    settings,
    stepsAndCategories,
    dptRatios,
    consistency,
    paymentDemands,
    paymentDelays
  }
})
