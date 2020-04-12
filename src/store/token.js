import * as types from './mutation-types'
import Vue from 'vue'
import { beginLoading, setErrorMessage } from './loading.js'

const state = {
  token: null,
  user: null,
  isAdmin: false,
  isObserver: false,
  menuItems: [
    {
      id: 1,
      title: 'Opérations',
      icon: 'work',
      routerLink: { name: 'PhysicalOps' },
      needAdmin: false,
      excludeObserver: false,
      dataCy: 'opMenuItem'
    },
    {
      id: 2,
      title: 'Plans',
      icon: 'description',
      routerLink: { name: 'Plans' },
      needAdmin: false,
      excludeObserver: false,
      dataCy: 'planMenuItem'
    },
    {
      id: 3,
      title: 'PréProgrammation',
      icon: 'playlist_play',
      routerLink: { name: 'PreProgrammings' },
      needAdmin: false,
      excludeObserver: true,
      dataCy: 'preProgMenuItem'
    },
    {
      id: 4,
      title: 'Programmation',
      icon: 'playlist_add_check',
      routerLink: { name: 'Programmings' },
      needAdmin: true,
      excludeObserver: true,
      dataCy: 'progMenuItem'
    },
    {
      id: 5,
      title: 'Consommation CP',
      icon: 'payment',
      routerLink: { name: 'Payment' },
      needAdmin: false,
      excludeObserver: false,
      dataCy: 'paymentMenuItem'
    },
    {
      id: 6,
      title: 'Suivi de bénéficiaire',
      icon: 'perm_identity',
      routerLink: { name: 'Beneficiary' },
      needAdmin: false,
      excludeObserver: false,
      dataCy: 'beneficiaryMenuItem'
    },
    {
      id: 7,
      title: 'Départements',
      icon: 'my_location',
      routerLink: { name: 'Departments' },
      needAdmin: false,
      excludeObserver: false,
      dataCy: 'departmentMenuItem'
    }
    // Switched as it is unused
    // {
    //   id: 7,
    //   title: 'Scénarios',
    //   icon: 'playlist_add',
    //   routerLink: { name: 'Scenarios' },
    //   needAdmin: true,
    //   excludeObserver: true
    // },
  ],
  summariesMenuItems: [
    {
      id: 1,
      title: 'Programmation annuelle',
      routerLink: { name: 'AnnualProg' },
      dataCy: 'annualProgMenuItem'
    },
    {
      id: 2,
      title: 'Besoins, pré- et programmation',
      routerLink: { name: 'PrevPreProg' },
      dataCy: 'prevPreProgMenuItem'
    },
    {
      id: 3,
      title: 'Programmation annuelle par actions',
      routerLink: { name: 'ActionAnnualProg' },
      dataCy: 'actionAnnualProgMenuItem'
    },
    {
      id: 4,
      title: 'Besoins pluriannuels',
      routerLink: { name: 'MultiAnnualPrev' },
      dataCy: 'multiAnnualPrevMenuItem'
    },
    {
      id: 5,
      title: 'Pluriannuel AP par actions',
      routerLink: { name: 'ActionMultiAnnualPrev' },
      dataCy: 'actionMultiAnnualPrevMenuItem'
    },
    {
      id: 6,
      title: 'Prévisions annuelles CP par actions',
      routerLink: { name: 'ActionPaymentPrev' },
      dataCy: 'actionPaymentPrevMenuItem'
    },
    {
      id: 7,
      title: 'Prévisions pluriannuelles CP',
      routerLink: { name: 'MultiAnnualPmtPrev' },
      dataCy: 'multiAnnualPmtPrevMenuItem'
    },
    {
      id: 8,
      title: 'Délais de paiement',
      routerLink: { name: 'PaymentDelays' },
      dataCy: 'paymentDelayMenuItem'
    }
  ],
  settingsMenuItems: [
    {
      id: 1,
      title: 'Utilisateurs',
      routerLink: { name: 'Users' },
      dataCy: 'usersMenuItem'
    },
    {
      id: 2,
      title: 'Imports',
      routerLink: { name: 'Uploads' },
      dataCy: 'uploadMenuItem'
    },
    {
      id: 3,
      title: 'Demandes de paiement',
      routerLink: { name: 'PaymentDemands' },
      dataCy: 'pmtDemandsMenuItem'
    },
    {
      id: 4,
      title: 'Étapes et catégories d\'opérations',
      routerLink: { name: 'StepsCategories' },
      dataCy: 'stepsCategoriesMenuItem'
    },
    {
      id: 5,
      title: 'Liens engagements / opérations',
      routerLink: { name: 'CmtOpLinks' },
      dataCy: 'cmtOpLinksMenuItem'
    },
    {
      id: 6,
      title: 'Liens dossiers en cours / opérations',
      routerLink: { name: 'PendingsOpLinks' },
      dataCy: 'pendingsOpLinksMenuItem'
    },
    {
      id: 7,
      title: 'Liens engagements / plans',
      routerLink: { name: 'CmtPlanLinks' },
      dataCy: 'cmtPlanLinksMenuItem'
    },
    {
      id: 8,
      title: 'Gestion des bénéficiaires',
      routerLink: { name: 'Beneficiaries' },
      dataCy: 'beneficiariesMenuItem'
    },
    {
      id: 9,
      title: 'Gestion des commissions',
      routerLink: { name: 'Commissions' },
      dataCy: 'commissionsMenuItem'
    },
    {
      id: 10,
      title: 'Gestion de la structure budgétaire',
      routerLink: { name: 'Budget' },
      dataCy: 'budgetMenuItem'
    },
    {
      id: 11,
      title: 'AP votées, gelées, mises en réserve',
      routerLink: { name: 'BudgetCredits' },
      dataCy: 'budgetCreditsMenuItem'
    },
    {
      id: 12,
      title: 'Contrôles de cohérence',
      routerLink: { name: 'Consistency' },
      dataCy: 'consistencyMenuItem'
    }
  ]
}

// getters
const getters = {
  parsedMenuItems: state => state.menuItems.filter(
    i =>
      state.isAdmin ||
      (!i.needAdmin && (!i.excludeObserver || !state.isObserver))
  )
}

// action
const actions = {
  async [types.SIGN_IN] ({ commit }, { email, password, router }) {
    beginLoading(commit)
    try {
      const response = await Vue.http.post('user/signin', { email, password })
      commit(types.SET_TOKEN, response.data)
      commit(types.END_LOADING)
      router.push({ name: 'Home' })
    } catch (response) {
      setErrorMessage(commit, response)
    }
  },
  async [types.LOG_OUT] ({ commit }) {
    beginLoading(commit)
    commit(types.DEL_TOKEN)
    try {
      await Vue.http.post('user/logout')
      commit(types.END_LOADING)
    } catch (response) {
      commit(types.DEL_TOKEN)
      setErrorMessage(commit, response)
    }
  }
}

// mutations
const mutations = {
  [types.RETRIEVE_TOKEN_FROM_LOCAL_STORAGE] (state) {
    const name = window.localStorage.getItem('ProperaUserName')
    const token = window.localStorage.getItem('ProperaToken')
    const isAdmin = window.localStorage.getItem('ProperaIsUserAdmin') === 'true'
    const isObserver = window.localStorage.getItem('ProperaIsUserObserver') === 'true'
    if (!name || !token) {
      state.token = null
      state.name = null
      state.isAdmin = false
      return
    }
    state.user = { name }
    state.token = token
    state.isAdmin = isAdmin
    state.isObserver = isObserver
    Vue.http.headers.common.Authorization = 'Bearer ' + token
  },
  [types.SET_TOKEN] (state, payload) {
    state.token = payload.token
    state.user = payload.user
    state.isAdmin = payload.user.role === 'ADMIN'
    state.isObserver = payload.user.role === 'OBSERVER'
    Vue.http.headers.common.Authorization = 'Bearer ' + payload.token
    window.localStorage.setItem('ProperaToken', payload.token)
    window.localStorage.setItem('ProperaUserName', payload.user.name)
    window.localStorage.setItem('ProperaIsUserAdmin', state.isAdmin.toString())
    window.localStorage.setItem('ProperaIsUserObserver', state.isObserver.toString())
  },
  [types.DEL_TOKEN] (state) {
    state.token = null
    state.user = null
    state.isAdmin = false
    state.isObserver = false
    Vue.http.headers.common.Authorization = ''
    window.localStorage.removeItem('ProperaToken')
    window.localStorage.removeItem('ProperaUserName')
    window.localStorage.removeItem('ProperaIsUserAdmin')
    window.localStorage.removeItem('ProperaIsUserObserver')
  },
  [types.REFRESH_TOKEN] (state, { token }) {
    state.token = token
    Vue.http.headers.common.Authorization = 'Bearer ' + token
    window.localStorage.setItem('ProperaToken', token)
  }
}

export default { state, getters, mutations, actions }
