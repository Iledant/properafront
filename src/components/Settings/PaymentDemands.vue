<template>
  <v-card>
    <v-card-title class="secondary">Gestion des demandes de paiement</v-card-title>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            label="Recherche"
            single-line
            hide-details
            v-model="search"
            prepend-icon="search"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :loading="loading"
            :headers="headers"
            :items="paymentDemands"
            :search="search"
            dense
            class="elevation-1"
            no-data-text="Aucune demande de paiement trouvée"
            no-results-text="Recherche infructueuse"
          >
            <template #item="{item}">
              <tr>
                <td class="px-0">
                  <v-tooltip right color="primary">
                    <template #activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        @click="edit(item)"
                        color="secondary"
                        v-on="on"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </template>
                    <span>Modifier l'exclusion</span>
                  </v-tooltip>
                </td>
                <td>{{ item.import_date | dateFilter }}</td>
                <td>{{ item.iris_code }}</td>
                <td>{{ item.beneficiary }}</td>
                <td>{{ item.demand_date | dateFilter }}</td>
                <td>{{ item.demand_value | valueFilter }}</td>
                <td>
                  <v-tooltip left color="primary">
                    <template #activator="{ on }">
                      <div v-on="on">{{ item.csf_date | dateFilter }}</div>
                    </template>
                    <span>{{ item.csf_comment || '-' }}</span>
                  </v-tooltip>
                </td>
                <td>{{ item.processed_date | dateFilter }}</td>
                <td>
                  <v-tooltip left color="primary">
                    <template #activator="{ on }">
                      <div v-on="on">{{ item.excluded | yesNoFilter }}</div>
                    </template>
                    <span>{{ item.excluded_comment || '-' }}</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn color="primary" text @click="download">Export Excel</v-btn>
    </v-card-actions>
    <payment-demand-dlg :paymentDemand="item" v-model="showDlg" @save="save" />
  </v-card>
</template>

<script>
import * as types from '@/store/mutation-types.js'
import PaymentDemandDlg from './PaymentDemands/PaymentDemandDlg.vue'
import { excelExport, valStyle, dateStyle } from '@/components/Utils/excelExport'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'PaymentDemands',
  components: { PaymentDemandDlg },
  data: () => ({
    search: '',
    headers: [
      { text: '', value: '', sortable: false, width: '1%' },
      { text: 'Import', value: 'import_date' },
      { text: 'Code IRIS', value: 'iris_code' },
      { text: 'Bénéficiaire', value: 'beneficiary' },
      { text: 'Demandé le', value: 'demand_date' },
      { text: 'Montant', value: 'demand_value' },
      { text: 'CSF le', value: 'csf_date' },
      { text: 'Traité le', value: 'processed_date' },
      { text: 'Exclus', value: 'excluded' }
    ],
    item: { excluded: false, excluded_comment: null },
    showDlg: false
  }),
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      paymentDemands: state => state.paymentDemands.paymentDemands
    })
  },
  methods: {
    edit (item) {
      this.item = { ...item }
      this.showDlg = true
    },
    save () {
      this.$store.dispatch(types.UPDATE_PAYMENT_DEMAND,
        { PaymentDemand: this.item })
    },
    download () {
      const lines = this.paymentDemands.map(l =>
        ({
          import_date: new Date(l.import_date),
          iris_code: l.iris_code,
          iris_name: l.iris_name,
          beneficiary_code: l.beneficiary_code,
          beneficiary: l.beneficiary,
          demand_number: l.demand_number,
          demand_date: new Date(l.demand_date),
          receipt_date: new Date(l.receipt_date),
          demand_value: l.demand_value * 0.01,
          csf_date: l.csf_date ? new Date(l.csf_date) : null,
          csf_comment: l.csf_comment,
          demand_status: l.demand_status,
          status_comment: l.status_comment,
          excluded: l.excluded,
          excluded_comment: l.excluded_comment,
          processed_date: l.processed_date ? new Date(l.processed_date) : null
        })
      )
      const columns = [
        { header: 'Importé le', key: 'import_date', ...dateStyle },
        { header: 'Code IRIS', key: 'iris_code', width: 20 },
        { header: 'Nom IRIS', key: 'iris_name', width: 30 },
        { header: 'Code bén.', key: 'beneficiary_code', width: 10 },
        { header: 'Bénéficiaire', key: 'beneficiary', width: 30 },
        { header: 'Num. ', key: 'demand_number', width: 8 },
        { header: 'Demandé le', key: 'demand_date', ...dateStyle },
        { header: 'Reçu le', key: 'receipt_date', ...dateStyle },
        { header: 'Montant', key: 'demand_value', ...valStyle },
        { header: 'CSF le', key: 'csf_date', ...dateStyle },
        { header: 'Commentaire', key: 'csf_comment', width: 30 },
        { header: 'Status', key: 'demand_status', width: 20 },
        { header: 'Commentaire', key: 'status_comment', width: 20 },
        { header: 'Exclus', key: 'excluded', width: 8 },
        { header: 'Commentaire', key: 'excluded_comment', width: 20 },
        { header: 'Traité le', key: 'processed_date', ...dateStyle }
      ]
      excelExport(lines, columns, 'Demandes de paiement')
    }
  },
  created () {
    this.$store.dispatch(types.GET_PAYMENT_DEMANDS)
  }
}
</script>
