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
            v-model="pSearch"
          />
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="pHeaders"
            :items="paymentList"
            :loading="loading"
            no-data-text="Aucun mandat"
            no-results-text="Aucun mandat trouvé"
            :search="pSearch"
            dense
            class="elevation-1"
          >
            <template v-slot:item="{item}">
              <tr>
                <td class="text-center">{{ item.date | dateFilter }}</td>
                <td>{{ item.iris_code }}</td>
                <td>{{ item.beneficiary }}</td>
                <td class="text-right">{{ item.value | valueFilter }}</td>
              </tr>
            </template>
            <template v-slot:body.append="">
              <tr class="grey lighten-4">
                <td colspan="3" class="text-center">
                  <strong>Total</strong>
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
      <v-btn text small color="primary" @click="onPaymentDownload">Export Excel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { excelExport } from '../Utils/excelExport'

export default {
  name: 'OpPayments',
  data: () => ({
    pHeaders: [
      { text: 'Date', value: 'date', align: 'center' },
      { text: 'Code IRIS', value: 'iris_code', align: 'center' },
      { text: 'Bénéficiaire', value: 'beneficiary', align: 'center' },
      { text: 'Montant', value: 'payment', align: 'center' }
    ],
    pSearch: ''
  }),
  props: { op: Object },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    paymentList () {
      return this.$store.state.previsions.paymentList
    },
    paymentTotal () {
      return this.paymentList.reduce((a, c) => a + c.value, 0)
    }
  },
  methods: {
    onPaymentDownload () {
      const lines = this.paymentList.map(p => ({
        date: new Date(p.date),
        iris_code: p.iris_code,
        beneficiary: p.beneficiary,
        value: p.value ? 0.01 * p.value : 0
      }))
      const columns = [
        {
          header: 'Date',
          key: 'date',
          width: 12,
          style: { numberFormat: 'dd/mm/yyyy' }
        },
        { header: 'Code IRIS', key: 'iris_code', width: 10 },
        { header: 'Bénéficiaire', key: 'beneficiary', width: 50 },
        {
          header: 'Montant',
          key: 'value',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        }
      ]
      excelExport(lines, columns, this.op.number + ' liste des mandats')
    }
  }
}
</script>
