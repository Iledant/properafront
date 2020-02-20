import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'
import * as types from './store/mutation-types'
import vueDebounce from 'vue-debounce'
import VueCurrencyInput from 'vue-currency-input'
import IntInput from './int-input'
import TRIInput from './tri-input'
import PercentageInput from './percentage-input'

import vuetify from './plugins/vuetify'

import {
  dateFilter,
  shortDateFilter,
  dateValueFilter,
  lengthFilter,
  valueFilter,
  TRIFilter,
  percentage,
  yesNoFilter,
  truncate,
  prevFilter
} from './filters/filters.js'

Vue.config.productionTip = false
Vue.filter('dateFilter', dateFilter)
Vue.filter('shortDateFilter', shortDateFilter)
Vue.filter('dateValueFilter', dateValueFilter)
Vue.filter('lengthFilter', lengthFilter)
Vue.filter('valueFilter', valueFilter)
Vue.filter('percentage', percentage)
Vue.filter('TRIFilter', TRIFilter)
Vue.filter('yesNoFilter', yesNoFilter)
Vue.filter('truncate', truncate)
Vue.filter('prevFilter', prevFilter)

Vue.use(VueResource)
Vue.http.options.root = process.env.VUE_APP_API_PATH
Vue.http.interceptors.push((request, next) => {
  next(response => {
    const error = response.body.error
    if (types.TOKEN_ERROR_MESSAGE.includes(error)) {
      store.commit(types.DEL_TOKEN)
      store.commit(types.SET_ERROR_MESSAGE, 'Erreur de connexion, merci de vous identifier')
    }
    const Authorization = response.headers.get('Authorization')
    if (Authorization) {
      const token = Authorization.replace('Bearer ', '')
      store.commit(types.REFRESH_TOKEN, { token })
    }
  })
})

Vue.use(vueDebounce)
Vue.use(VueCurrencyInput, {
  globalOptions: {
    locale: 'fr-FR',
    distractionFree: false,
    min: 0
  }
})

Vue.directive('int-input', IntInput)
Vue.directive('tri-input', TRIInput)
Vue.directive('percentage-input', PercentageInput)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
