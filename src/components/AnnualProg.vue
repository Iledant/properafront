<template>
  <v-card>
    <v-card-title class="secondary title">Suivi de la programmation annuelle</v-card-title>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-select
            :items="prgYears"
            v-model="year"
            label="Année de programmation"
            item-value="year"
            item-text="year"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            append-icon="search"
            label="Recherche"
            single-line
            hide-details
            v-model="search"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="items"
            class="elevation-1 mt-2"
            :loading="loading"
            :search="search"
            dense
            no-data-text="Aucune ligne à afficher"
            no-results-text="Recherche infructueuse"
          >
            <template v-slot:body.prepend="">
              <tr class="grey lighten-4 font-weight-medium">
                <td colspan="2" class="text-center">Total</td>
                <td class="text-right text-no-wrap">{{ programmingsTotal | valueFilter }}</td>
                <td class="text-right text-no-wrap">{{ commitmentTotal | valueFilter }}</td>
                <td class="text-right text-no-wrap">{{ pendingsTotal | valueFilter }}</td>
              </tr>
              <tr class="grey lighten-4 font-weight-medium">
                <td colspan="2" class="text-center">Budget disponible</td>
                <td class="text-right text-no-wrap">{{ availableBudget | valueFilter }}</td>
                <td class="text-right text-no-wrap"></td>
                <td class="text-right text-no-wrap"></td>
              </tr>
            </template>
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.operation_number }} - {{ item.name }}</td>
                <td>{{ item.date | dateFilter }}</td>
                <td class="text-right text-no-wrap">{{ item.programmings | valueFilter }}</td>
                <td class="text-right text-no-wrap">{{ item.commitment | valueFilter }}</td>
                <td class="text-right text-no-wrap">{{ item.pendings | valueFilter }}</td>
              </tr>
            </template>
            <template v-slot:body.append="">
              <tr class="grey lighten-4 font-weight-medium">
                <td colspan="2" class="text-center">Total</td>
                <td class="text-right text-no-wrap">{{ programmingsTotal | valueFilter }}</td>
                <td class="text-right text-no-wrap">{{ commitmentTotal | valueFilter }}</td>
                <td class="text-right text-no-wrap">{{ pendingsTotal | valueFilter }}</td>
              </tr>
              <tr class="grey lighten-4 font-weight-medium">
                <td colspan="2" class="text-center">Budget disponible</td>
                <td class="text-right text-no-wrap">{{ availableBudget | valueFilter }}</td>
                <td class="text-right text-no-wrap"></td>
                <td class="text-right text-no-wrap"></td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="caption">
          Date de mise à jour : {{ commitmentLastDate | dateFilter }} (engagements),
          {{ pendingsLastDate | dateFilter }} (dossiers en cours)
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn color="primary" text @click="download">Export Excel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { excelExport, dateStyle, valStyle } from './Utils/excelExport'
import * as types from '../store/mutation-types'
export default {
  name: 'AnnualProg',
  data () {
    return {
      year: new Date().getFullYear(),
      search: '',
      headers: [
        { text: 'Nom (opération, IRIS)', value: 'name', align: 'center' },
        { text: 'Date', value: 'date', align: 'center' },
        { text: 'Programmé', value: 'programmings', align: 'center' },
        { text: 'Affecté', value: 'commitment', align: 'center' },
        { text: 'En cours', value: 'pendings', align: 'center' }
      ]
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    items () {
      return this.$store.state.summaries.annualProg
    },
    creditsList () {
      return this.$store.state.budgetTables.creditsList
    },
    availableBudget () {
      return this.creditsList.reduce(
        (a, c) =>
          a +
          c.primary_commitment +
          c.frozen_commitment +
          c.reserved_commitment,
        0
      )
    },
    programmingsTotal () {
      return this.items.reduce((tot, i) => tot + (i.programmings || 0), 0)
    },
    commitmentTotal () {
      return this.items.reduce((tot, i) => tot + (i.commitment || 0), 0)
    },
    pendingsTotal () {
      return this.items.reduce((tot, i) => tot + (i.pendings || 0), 0)
    },
    prgYears () {
      return this.$store.state.programmings.programmingsYears
    },
    commitmentLastDate () {
      return this.$store.state.importLog.commitmentLastDate
    },
    pendingsLastDate () {
      return this.$store.state.importLog.pendingsLastDate
    }
  },
  methods: {
    download () {
      let lines = null
      if (this.items.length > 0) {
        lines = this.items.map(l => {
          return {
            number: l.operation_number,
            name: l.name,
            step_name: l.step_name,
            chapter: l.chapter_code,
            category_name: l.category_name,
            date: new Date(l.date),
            programmings: l.programmings * 0.01,
            pendings: l.pendings * 0.01,
            commitment: l.commitment * 0.01,
            totalProgrammings: l.total_programmings * 0.01,
            stateRatio: l.state_ratio,
            stateValue: ''
          }
        })
      }
      const columns = [
        { header: 'Numéro d\'opération', key: 'number', width: 8 },
        { header: 'Nom de l\'opération', key: 'name', width: 50 },
        { header: 'Chap', key: 'chapter', width: 8 },
        { header: 'Étape', key: 'step_name', width: 8 },
        { header: 'Cat', key: 'category_name', width: 8 },
        { header: 'Date', key: 'date', ...dateStyle },
        { header: 'Programmation', key: 'programmings', ...valStyle },
        { header: 'Programmation totale', key: 'totalProgrammings', ...valStyle },
        {
          header: 'Clé État',
          key: 'stateRatio',
          width: 14,
          style: { numberFormat: '0.00%' }
        },
        {
          header: 'Montant État',
          key: 'stateValue',
          formula: '=IF(AND(H£<>"",I£<>""),H£*I£,"")',
          ...valStyle
        },
        { header: 'Affecté', key: 'commitment', ...valStyle },
        { header: 'En cours', key: 'pendings', ...valStyle }
      ]
      excelExport(lines, columns, 'Programmation annuelle')
    }
  },
  watch: {
    year (y) {
      this.$store.dispatch(types.GET_ANNUAL_PROGRAMMATION, { year: y })
    }
  },
  created () {
    this.$store.dispatch(types.GET_INIT_ANNUAL_PROGRAMMATION, { year: this.year })
  }
}
</script>
