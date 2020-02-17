<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-autocomplete
            :items="beneficiariesList"
            v-model="beneficiaryId"
            label="Bénéficiaire"
            item-text="name"
            item-value="id"
            no-data-text="Aucune action trouvée"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <beneficiary-chronicles-chart :height="400" :beneficiaryId="beneficiaryId" />
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn
        text
        color="primary"
        :disabled="beneficiaryPaymentsChronicles.length === 0"
        @click="onExcelExport"
      >Export Excel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import BeneficiaryChroniclesChart from './BeneficiaryChroniclesChart.js'
import { excelExport } from '../Utils/excelExport.js'
export default {
  name: 'BeneficiaryChronicles',
  components: { 'beneficiary-chronicles-chart': BeneficiaryChroniclesChart },
  data: () => ({ beneficiaryId: null }),
  computed: {
    beneficiariesList () {
      return this.$store.state.beneficiaries.beneficiaries
    },
    beneficiaryPaymentsChronicles () {
      return this.$store.state.previsions.beneficiaryPaymentsChronicles
    }
  },
  methods: {
    onExcelExport () {
      const decemberChronicles = this.beneficiaryPaymentsChronicles.filter(
        c => c.month === 12
      )
      const lines = decemberChronicles.map(l => ({
        year: l.year,
        cumulated: l.cumulated
      }))
      const columns = [
        { header: 'Année', key: 'year', width: 8 },
        {
          header: 'Consommation',
          key: 'cumulated',
          width: 20,
          style: { numberFormat: '#,##0.00' }
        }
      ]
      excelExport(lines, columns, 'Consommation bénéficiaire')
    }
  }
}
</script>
