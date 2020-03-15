<template>
  <v-card>
    <v-card-title class="secondary">
      Prévisions de CP par actions budgétaires pour l'année en cours
    </v-card-title>
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
            :items="items"
            :search="search"
            dense
            class="elevation-1"
            no-data-text="Aucune prévision trouvée"
            no-results-text="Recherche infructueuse"
          >
            <template #item="{item}">
              <tr>
                <td>{{ item.chapter }}</td>
                <td>{{ item.sector }}</td>
                <td>{{ item.function }}</td>
                <td>{{ item.action_code }}</td>
                <td>{{ item.action_name }}</td>
                <td class="text-right">{{ item.pmt_prevision | prevFilter }}</td>
                <td class="text-right">{{ item.payment | prevFilter }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn text color="primary" @click="dataExport">Export Excel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as types from '../store/mutation-types'
import { excelExport, valStyle } from './Utils/excelExport'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'ActionPaymentPrev',
  data () {
    return {
      search: '',
      headers: [
        { text: 'Chapitre', value: 'chapter' },
        { text: 'Secteur', value: 'sector' },
        { text: 'Fonction', value: 'function' },
        { text: 'Action', value: 'action_code' },
        { text: 'Nom', value: 'action_name' },
        { text: 'Prévision', value: 'pmt_prevision', align: 'right' },
        { text: 'Paiements', value: 'payment', align: 'right' }
      ]
    }
  },
  methods: {
    async dataExport () {
      if (this.items.length === 0) return
      const columns = [
        { header: 'Chap.', key: 'chapter', width: 10 },
        { header: 'Sect.', key: 'sector', width: 10 },
        { header: 'Fonction', key: 'function', width: 10 },
        { header: 'Code action', key: 'action_code', width: 16 },
        { header: 'Nom action', key: 'action_name', width: 60 },
        { header: 'Prévision', key: 'pmt_prevision', ...valStyle },
        { header: 'Paiements', key: 'payment', ...valStyle }
      ]
      excelExport(this.items, columns, 'Prévision paiement par actions')
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      items: state => state.previsions.curYearActionPmtPrevisions
    })
  },
  created () {
    this.$store.dispatch(types.GET_CUR_YEAR_ACTION_PMT_PREV)
  }
}
</script>
