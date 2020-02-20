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
            :items="items"
            class="elevation-1"
            :loading="loading"
            :search="prevPaymentSearch"
          >
            <template #item="{ item }">
              <tr>
                <td>{{ item.name }}</td>
                <td class="text-right">{{ item.prev_payment | valueFilter }}</td>
                <td class="text-right">{{ item.payment | valueFilter }}</td>
              </tr>
            </template>
            <template #body.append="">
              <tr class="grey lighten-4 font-weight-medium">
                <td>Total</td>
                <td class="text-right">{{ prevPaymentTotal | valueFilter }}</td>
                <td class="text-right ">{{ paymentTotal | valueFilter }}</td>
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
        @click="download"
        :disabled="!paymentPrevTypeId"
      >Export Excel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as types from '../../store/mutation-types.js'
import { excelExport, valStyle } from '../Utils/excelExport.js'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'PaymentPerBeneficiary',
  data: () => ({
    paymentPrevTypeId: null,
    prevPaymentSearch: '',
    prevPaymentHeaders: [
      { text: 'Bénéficiaire', value: 'name' },
      { text: 'Prévision', value: 'prev_payment', align: 'right' },
      { text: 'Consommé', value: 'payment', align: 'right' }
    ],
    actualYear: new Date().getFullYear()
  }),
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      items: state => state.summaries.previsionAndRealizedList,
      paymentTypes: state => state.paymentRatios.paymentTypes
    }),
    prevPaymentTotal () {
      return this.items.reduce((a, i) => a + i.prev_payment, 0)
    },
    paymentTotal () {
      return this.items.reduce((a, i) => a + i.payment, 0)
    }
  },
  methods: {
    download () {
      if (this.items.length > 0) {
        const lines = this.items.map(l => ({
          name: l.name,
          prev_payment: l.prev_payment ? l.prev_payment * 0.01 : 0,
          payment: l.payment ? l.payment * 0.01 : 0
        }))
        const columns = [
          { header: 'Bénéficiaire', key: 'name', width: 80 },
          { header: 'Prévision', key: 'prev_payment', ...valStyle },
          { header: 'Consommé', key: 'payment', ...valStyle }
        ]
        excelExport(lines, columns, 'Consommation bénéficiaire')
      }
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
