<template>
  <v-card>
    <v-card-title class="secondary">
      Ventilation de la programmation annuelle par actions budgétaires
    </v-card-title>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-select
            :items="prgYears"
            v-model="year"
            label="Année de programmation"
            item-value="year"
            item-text="year"
            prepend-icon="calendar_today"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            prepend-icon="search"
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
            <template #body.prepend="">
              <tr class="grey lighten-4 font-weight-medium">
                <td colspan="2" class="text-center">Total</td>
                <td class="text-right text-no-wrap">
                  {{ total | valueFilter }}
                </td>
              </tr>
            </template>
            <template #item="{item}">
              <tr>
                <td>{{ item.action_code }}</td>
                <td>{{ item.action_name }}</td>
                <td class="text-right text-no-wrap">
                  {{ item.value | valueFilter }}
                </td>
              </tr>
            </template>
            <template #body.append="">
              <tr class="grey lighten-4 font-weight-medium">
                <td colspan="2" class="text-center">Total</td>
                <td class="text-right text-no-wrap">
                  {{ total | valueFilter }}
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn color="primary" text @click="download" :disabled="!this.items.length">
        Export Excel
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { excelExport, valStyle } from './Utils/excelExport'
import * as types from '../store/mutation-types'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'ActionAnnualProg',
  data () {
    return {
      year: new Date().getFullYear(),
      search: '',
      headers: [
        { text: 'Numéro d\'action', value: 'action_code' },
        { text: 'Intitulé', value: 'action_name' },
        { text: 'Programmé', value: 'value', align: 'right' }
      ]
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      prgYears: s => s.programmings.programmingsYears,
      items: s => s.summaries.budgetProg
    }),
    total () {
      return this.items.reduce((a, c) => a + c.value, 0)
    }
  },
  methods: {
    download () {
      if (!this.items.length) return
      const lines = this.items.map(l =>
        ({ code: l.action_code, name: l.action_name, value: l.value * 0.01 })
      )
      const columns = [
        { header: 'Code d\'action', key: 'code', width: 15 },
        { header: 'Intitulé', key: 'name', width: 50 },
        { header: 'Programmation', key: 'value', ...valStyle }
      ]
      excelExport(lines, columns, 'Programmation par action')
    }
  },
  created () {
    this.$store.dispatch(types.GET_BUDGET_ACTION_PROGRAMMATION_AND_YEARS,
      { year: this.actualYear })
  },
  watch: {
    year (y) {
      this.$store.dispatch(types.GET_BUDGET_ACTION_PROGRAMMATION,
        { year: y })
    }
  }
}
</script>
