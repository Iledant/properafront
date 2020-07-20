<template>
  <v-card>
    <v-card-title class="secondary title">Délais de paiement</v-card-title>
    <v-container fluid class="pa-0">
      <v-tabs v-model="activeTab" background-color="secondary" slider-color="primary" centered>
        <v-tab ripple>Evolution</v-tab>
        <v-tab-item>
          <delay-chart />
        </v-tab-item>
        <v-tab ripple>Distribution</v-tab>
        <v-tab-item>
          <delays-distribution />
        </v-tab-item>
        <v-tab ripple>Stock de CSF</v-tab>
        <v-tab-item>
          <demands-stock />
        </v-tab-item>
      </v-tabs>
    </v-container>
  </v-card>
</template>

<script>
import DelaysDistribution from './PaymentDelays/DelaysDistribution.vue'
import DelayChart from './PaymentDelays/DelayChart.vue'
import DemandsStock from './PaymentDelays/DemandsStock.vue'
export default {
  name: 'PaymentDelays',
  components: { DelaysDistribution, DemandsStock, DelayChart },
  data () {
    return {
      activeTab: null
    }
  }
}
</script>
