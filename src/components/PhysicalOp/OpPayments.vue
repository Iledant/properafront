<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            prepend-icon="search"
            label="Recherche"
            class="pb-3"
            single-line
            hide-details
            v-model="search"
          />
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="pHeaders"
            :items="filteredPayments"
            :loading="loading"
            no-data-text="Aucun mandat"
            no-results-text="Aucun mandat trouvé"
            :search="search"
            dense
            class="elevation-1"
          >
            <template #body.prepend>
              <tr class="grey lighten-4">
                <td colspan="3" class="text-center">
                  <strong>Total de la recherche</strong>
                </td>
                <td class="text-right">
                  <strong>{{ paymentTotal | valueFilter }}</strong>
                </td>
              </tr>
            </template>
            <template #item="{item}">
              <tr>
                <td class="text-right">{{ item.date | dateFilter }}</td>
                <td class="text-right">{{ item.receipt_date | dateFilter }}</td>
                <td>{{ item.iris_code }}</td>
                <td>{{ item.beneficiary }}</td>
                <td class="text-right">{{ item.value | valueFilter }}</td>
              </tr>
            </template>
            <template #body.append>
              <tr class="grey lighten-4">
                <td colspan="3" class="text-center">
                  <strong>Total de la recherche</strong>
                </td>
                <td class="text-right">
                  <strong>{{ paymentTotal | valueFilter }}</strong>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn text color="primary" @click="download">Export Excel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { excelExport, dateStyle, valStyle } from '../Utils/excelExport'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'OpPayments',
  data: () => ({
    pHeaders: [
      { text: 'Date mandat', value: 'date', align: 'right' },
      { text: 'Date réception', value: 'receipt_date', align: 'right' },
      { text: 'Code IRIS', value: 'iris_code' },
      { text: 'Bénéficiaire', value: 'beneficiary' },
      { text: 'Montant', value: 'payment', align: 'right' }
    ],
    search: ''
  }),
  props: { op: Object },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      payments: state => state.previsions.paymentList
    }),
    filteredPayments () {
      const upSearch = this.search.toUpperCase()
      return this.payments.filter(f => Object.values(f).some(
        v => v && v.toString().toUpperCase().includes(upSearch)))
    },
    paymentTotal () {
      return this.filteredPayments.reduce((a, c) => a + c.value, 0)
    }
  },
  methods: {
    download () {
      const lines = this.payments.map(p => ({
        date: new Date(p.date),
        receipt_date: p.receipt_date ? new Date(p.receipt_date) : null,
        iris_code: p.iris_code,
        beneficiary: p.beneficiary,
        value: p.value ? 0.01 * p.value : 0
      }))
      const columns = [
        { header: 'Date mandat', key: 'date', ...dateStyle },
        { header: 'Date réception', key: 'receipt_date', ...dateStyle },
        { header: 'Code IRIS', key: 'iris_code', width: 10 },
        { header: 'Bénéficiaire', key: 'beneficiary', width: 50 },
        { header: 'Montant', key: 'value', ...valStyle }
      ]
      excelExport(lines, columns, this.op.number + ' liste des mandats')
    }
  }
}
</script>
