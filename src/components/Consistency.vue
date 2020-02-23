<template>
  <v-card>
    <v-card-title class="secondary title">Tests de cohérence</v-card-title>
    <v-container fluid class="pa-0">
      <v-tabs
        v-model="activeTab"
        background-color="secondary"
        slider-color="primary"
        centered
      >
        <v-tab ripple>Engagements sans action budgétaire</v-tab>
        <v-tab-item><commitments-without-action /></v-tab-item>
        <v-tab ripple>Paiements non liés à une AP</v-tab>
        <v-tab-item><unlinked-payments /></v-tab-item>
      </v-tabs>
    </v-container>
  </v-card>
</template>

<script>
import * as types from '../store/mutation-types.js'
import CommitmentsWithoutAction from './CommitmentsWithoutAction.vue'
import UnlinkedPayments from './UnlinkedPayments.vue'
export default {
  name: 'Consistency',
  data () {
    return {
      activeTab: null
    }
  },
  components: { CommitmentsWithoutAction, UnlinkedPayments },
  created () {
    this.$store.dispatch(types.GET_CONSISTENCY_DATAS)
  }
}
</script>
