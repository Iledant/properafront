<template>
  <v-card>
    <v-card-title class="secondary title">Prévisions pluriannuelles de CP</v-card-title>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12>
          <v-data-table
            :loading="loading"
            :headers="headers"
            :items="items"
            hide-default-footer
            dense
            class="elevation-1"
            no-data-text="Aucune prévision trouvée"
          >
            <template v-slot:item="{item}">
              <tr>
                <td>{{ item.year }}</td>
                <td class="text-right">{{ item.pmtMin | prevFilter }}</td>
                <td class="text-right">{{ item.pmtMax | prevFilter }}</td>
                <td class="text-right">{{ item.difPmt | prevFilter }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12>
          <prev-chart :height="400" class="mt-3" />
        </v-flex>
        <v-flex>
          <v-btn text icon @click="dlg=true">
            <v-icon>info</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn text color="primary" @click="opDownload">Export Excel opération</v-btn>
      <v-btn text color="primary" @click="download">Export Excel</v-btn>
    </v-card-actions>
    <prev-info-dlg v-model="dlg" />
  </v-card>
</template>

<script>
import * as types from '../store/mutation-types'
import { excelExport, valStyle } from './Utils/excelExport'
import { mapGetters, mapState } from 'vuex'
import PrevChart from './MultiAnnualPmtPrevChart.js'
import PrevInfoDlg from './PmtPrevInfoDlg.vue'
export default {
  name: 'MultiAnnualPmtPrev',
  components: { PrevChart, PrevInfoDlg },
  data () {
    return {
      headers: [
        { text: 'Année', value: 'year' },
        { text: 'Prév. directe min', value: 'pmtMin', align: 'right' },
        { text: 'Prév. directe max', value: 'pmtMax', align: 'right' },
        { text: 'Prév. RAM', value: 'difPmt', align: 'right' }
      ],
      dlg: false
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      items: state => state.previsions.paymentPrevisions,
      actionItems: state => state.previsions.actionPaymentPrevisions,
      opItems: state => state.previsions.opPaymentPrevisions
    })
  },
  methods: {
    async download () {
      await this.$store.dispatch(types.GET_ACTION_PAYMENT_PREVISION)
      if (this.actionItems.length === 0) {
        return
      }
      const y = new Date().getFullYear()
      const columns = [
        { header: 'Chap.', key: 'chapter', width: 10 },
        { header: 'Code action', key: 'action_code', width: 16 },
        { header: 'Nom action', key: 'action_name', width: 60 },
        { header: String(y), key: 'y0', ...valStyle },
        { header: String(y + 1), key: 'y1', ...valStyle },
        { header: String(y + 2), key: 'y2', ...valStyle },
        { header: String(y + 3), key: 'y3', ...valStyle },
        { header: String(y + 4), key: 'y4', ...valStyle }
      ]
      excelExport(this.actionItems, columns, 'Prévision CP par actions')
    },
    async opDownload () {
      await this.$store.dispatch(types.GET_OP_PAYMENT_PREVISION)
      if (this.opItems.length === 0) {
        return
      }
      const y = new Date().getFullYear()
      const columns = [
        { header: 'Chap.', key: 'op_chapter', width: 10 },
        { header: 'Num op.', key: 'op_number', width: 16 },
        { header: 'Nom opération', key: 'op_name', width: 60 },
        { header: String(y), key: 'y0', ...valStyle },
        { header: String(y + 1), key: 'y1', ...valStyle },
        { header: String(y + 2), key: 'y2', ...valStyle },
        { header: String(y + 3), key: 'y3', ...valStyle },
        { header: String(y + 4), key: 'y4', ...valStyle }
      ]
      excelExport(this.opItems, columns, 'Prévision CP par opération')
    }
  },
  created () {
    this.$store.dispatch(types.GET_PAYMENT_PREVISION)
  }
}
</script>
