<template>
  <v-card>
    <v-card-title class="secondary">Suivi de bénéficiaire</v-card-title>
    <v-container fluid class="pa-0">
      <v-tabs
        v-model="activeTab"
        background-color="secondary"
        slider-color="primary"
        centered
      >
        <v-tab ripple>Situation AP</v-tab>
        <v-tab-item><commitment-per-beneficiary /></v-tab-item>
        <v-tab ripple>Historique CP</v-tab>
        <v-tab-item><beneficiary-chronicles /></v-tab-item>
      </v-tabs>
    </v-container>
  </v-card>
</template>

<script>
import * as types from '../store/mutation-types.js'
import BeneficiaryChronicles from './Payment/BeneficiaryChronicles.vue'
import CommitmentPerBeneficiary from './CommitmentPerBeneficiary.vue'

export default {
  name: 'Beneficiary',
  data: () => ({ activeTab: null }),
  components: { BeneficiaryChronicles, CommitmentPerBeneficiary },
  created () {
    this.$store.dispatch(types.GET_BENEFICIARIES)
  }
}
</script>
