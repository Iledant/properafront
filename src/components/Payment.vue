<template>
  <v-card>
    <v-card-title class="secondary">
      Consommation de crédits de paiement
    </v-card-title>
    <v-container fluid class="pa-0">
      <v-tabs
        v-model="activeTab"
        background-color="secondary"
        slider-color="primary"
        centered
      >
        <v-tab ripple>Consommation totale</v-tab>
        <v-tab-item>
          <v-container>
            <v-layout row wrap>
              <v-flex xs12>
                <payment-chart class="mt-3" :height="400" />
              </v-flex>
              <v-flex xs12>
                <payment-per-month-chart class="mt-3" :height="400" />
              </v-flex>
            </v-layout>
          </v-container>
        </v-tab-item>
        <v-tab ripple>Situation par bénéficiaire</v-tab>
        <v-tab-item><payment-per-beneficiary /></v-tab-item>
        <v-tab ripple>Prévisions des bénéficiaires</v-tab>
        <v-tab-item><payment-forecast /></v-tab-item>
        <v-tab ripple>Chroniques AP CP</v-tab>
        <v-tab-item><ratios /></v-tab-item>
        <v-tab ripple>Enveloppes de CP</v-tab>
        <v-tab-item><payment-credit /></v-tab-item>
      </v-tabs>
    </v-container>
  </v-card>
</template>

<script>
import * as types from '@/store/mutation-types.js'
import PaymentChart from './Home/PaymentChart.js'
import PaymentPerMonthChart from './Payment/PaymentPerMonthChart.js'
import PaymentPerBeneficiary from './Payment/PaymentPerBeneficiary.vue'
import PaymentCredit from './Payment/PaymentCredit.vue'
import PaymentForecast from './Payment/PaymentForecast.vue'
import Ratios from './Payment/Ratios.vue'

export default {
  name: 'Payment',
  data: () => ({
    activeTab: null,
    actualYear: new Date().getFullYear()
  }),
  components: {
    PaymentChart,
    PaymentPerMonthChart,
    Ratios,
    PaymentPerBeneficiary,
    PaymentCredit,
    PaymentForecast
  },
  created () {
    this.$store.dispatch(types.GET_PAYMENT_DATAS)
  }
}
</script>
