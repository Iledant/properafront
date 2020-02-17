<template>
  <v-container grid-list-md class="pa-0" fluid>
    <v-layout row wrap>
      <v-flex xs12>
        <div class="title mb-2">Opération : {{ opTitle }}</div>
      </v-flex>
      <v-flex xs12> <op-fields class="mb-2" :op="currentOp" /> </v-flex>
      <v-flex xs12>
        <v-tabs
          v-model="activeTab"
          background-color="secondary"
          slider-color="primary"
          grow
        >
          <v-tab ripple>
            <v-icon class="mr-2">date_range</v-icon> Événements
          </v-tab>
          <v-tab ripple>
            <v-icon class="mr-2">insert_drive_file</v-icon> Documents
          </v-tab>
          <v-tab ripple>
            <v-icon class="mr-2">trending_up</v-icon> Besoins
          </v-tab>
          <v-tab ripple>
            <v-icon class="mr-2">perm_identity</v-icon> Bénéficiaires
          </v-tab>
          <v-tab ripple>
            <v-icon class="mr-2">assignment</v-icon> Engagements
          </v-tab>
          <v-tab ripple>
            <v-icon class="mr-2">credit_card</v-icon> Paiements
          </v-tab>
          <v-tab-item> <op-events :op="currentOp" /> </v-tab-item>
          <v-tab-item> <op-documents :op="currentOp" /> </v-tab-item>
          <v-tab-item> <op-previsions :op="currentOp" /> </v-tab-item>
          <v-tab-item>
            <OpBeneficiariesState :op="currentOp" />
          </v-tab-item>
          <v-tab-item> <op-commitments :op="currentOp" /> </v-tab-item>
          <v-tab-item> <op-payments :op="currentOp" /> </v-tab-item>
        </v-tabs>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import * as types from '../store/mutation-types.js'
import OpFields from './PhysicalOp/OpFields.vue'
import OpEvents from './PhysicalOp/OpEvents.vue'
import OpPrevisions from './PhysicalOp/OpPrevisions.vue'
import OpDocuments from './PhysicalOp/OpDocuments.vue'
import OpBeneficiariesState from './PhysicalOp/OpBeneficiariesState.vue'
import OpCommitments from './PhysicalOp/OpCommitments.vue'
import OpPayments from './PhysicalOp/OpPayments.vue'

export default {
  name: 'PhysicalOp',
  data: () => ({
    currentOp: null,
    activeTab: null
  }),
  components: {
    OpFields,
    OpDocuments,
    OpEvents,
    OpPrevisions,
    OpBeneficiariesState,
    OpCommitments,
    OpPayments
  },
  computed: {
    opTitle () {
      return `${this.$route.params.op_number} - ${this.$route.params.op_name}`
    }
  },
  created () {
    const numberId = Number(this.$route.params.op_id)
    this.currentOp = this.$store.state.physops.ops.find(o => o.id === numberId)
    this.$store.dispatch(types.GET_PREVISIONS, { id: this.currentOp.id })
  }
}
</script>
