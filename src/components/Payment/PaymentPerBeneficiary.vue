<template>
  <v-card>
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-select
            :items="paymentTypes"
            v-model="paymentPrevTypeId"
            label="Chronique pour la prévision"
            single-line
            item-text="name"
            item-value="id"
            persistent-hint
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            prepend-icon="search"
            label="Recherche"
            single-line
            hide-details
            v-model="prevPaymentSearch"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :headers="prevPaymentHeaders"
            :items="previsionAndRealizedList"
            class="elevation-1"
            :loading="loading"
            :search="prevPaymentSearch"
          >
            <template slot="item" slot-scope="props">
              <tr>
                <td>{{ props.item.name }}</td>
                <td class="text-right">{{ props.item.prev_payment | valueFilter }}</td>
                <td class="text-right">{{ props.item.payment | valueFilter }}</td>
              </tr>
            </template>
            <template v-slot:body.append="">
              <tr>
                <td class="grey lighten-4">
                  <strong>Total</strong>
                </td>
                <td class="text-right grey lighten-4">
                  <strong>{{ prevPaymentTotal | valueFilter }}</strong>
                </td>
                <td class="text-right grey lighten-4">
                  <strong>{{ paymentTotal | valueFilter }}</strong>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="mt-2 mb-2 caption">
          Attention : les prévisions par bénéficiaire sont calculées uniquement par
          application de la chronique de transformation d'AP en CP sur les
          engagements des années précédentes. Elles ne tiennent compte ni des
          affectations de l'année, ni des prévisions spécifiques (par exemple d'un
          protocole).
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn
        color="primary"
        text
        @click="onPaymentPrevDownload"
        :disabled="!paymentPrevTypeId"
      >Export Excel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as types from '../../store/mutation-types.js'
import { excelExport } from '../Utils/excelExport.js'
export default {
  name: 'PaymentPerBeneficiary',
  data: () => ({
    paymentPrevTypeId: null,
    prevPaymentSearch: '',
    prevPaymentHeaders: [
      { text: 'Bénéficiaire', value: 'name', align: 'center', sortable: true },
      {
        text: 'Prévision',
        value: 'prev_payment',
        align: 'center',
        sortable: true
      },
      { text: 'Consommé', value: 'payment', align: 'center', sortable: true }
    ],
    actualYear: new Date().getFullYear()
  }),
  computed: {
    previsionAndRealizedList () {
      return this.$store.state.summaries.previsionAndRealizedList
    },
    prevPaymentTotal () {
      return this.previsionAndRealizedList.reduce(
        (a, i) => a + i.prev_payment,
        0
      )
    },
    paymentTotal () {
      return this.previsionAndRealizedList.reduce((a, i) => a + i.payment, 0)
    },
    paymentTypes () {
      return this.$store.state.paymentRatios.paymentTypes
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    onPaymentPrevDownload () {
      let lines = null
      if (this.previsionAndRealizedList.length > 0) {
        lines = this.previsionAndRealizedList.map(l => {
          return {
            name: l.name,
            prev_payment: l.prev_payment ? l.prev_payment * 0.01 : 0,
            payment: l.payment ? l.payment * 0.01 : 0
          }
        })
      }
      const columns = [
        { header: 'Bénéficiaire', key: 'name', width: 80 },
        {
          header: 'Prévision',
          key: 'prev_payment',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        },
        {
          header: 'Consommé',
          key: 'payment',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        }
      ]
      excelExport(lines, columns, 'Consommation bénéficiaire')
    }
  },
  watch: {
    paymentPrevTypeId (newId) {
      this.$store.dispatch(types.GET_PAYMENT_PREVISION_AND_REALIZED, {
        year: this.actualYear,
        paymentTypeId: newId
      })
    }
  }
}
</script>
