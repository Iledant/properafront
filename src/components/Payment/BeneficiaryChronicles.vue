<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-autocomplete
            :items="beneficiaries"
            v-model="beneficiaryId"
            label="Bénéficiaire"
            item-text="name"
            item-value="id"
            no-data-text="Aucune action trouvée"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <beneficiary-chronicles-chart
            :height="400"
            :beneficiaryId="beneficiaryId"
          />
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn
        text
        color="primary"
        :disabled="!chronicles.length"
        @click="download"
      >Export Excel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import BeneficiaryChroniclesChart from './BeneficiaryChroniclesChart.js'
import { excelExport, valStyle } from '../Utils/excelExport.js'
import { mapState } from 'vuex'
export default {
  name: 'BeneficiaryChronicles',
  components: { 'beneficiary-chronicles-chart': BeneficiaryChroniclesChart },
  data: () => ({ beneficiaryId: null }),
  computed: {
    ...mapState({
      beneficiaries: state => state.beneficiaries.beneficiaries,
      chronicles: state => state.previsions.beneficiaryPaymentsChronicles
    })
  },
  methods: {
    download () {
      const lines = this.chronicles.filter(c => c.month === 12).map(l =>
        ({ year: l.year, cumulated: l.cumulated }))
      const columns = [
        { header: 'Année', key: 'year', width: 8 },
        { header: 'Consommation', key: 'cumulated', ...valStyle }
      ]
      excelExport(lines, columns, 'Consommation bénéficiaire')
    }
  }
}
</script>
