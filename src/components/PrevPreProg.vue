<template>
  <v-card>
    <v-card-title class="secondary">
      Comparaison besoins, pré- et programmation
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
                <td class="text-right">{{ prgTotal | valueFilter }}</td>
                <td class="text-right">{{ prePrgTotal | valueFilter }}</td>
                <td class="text-right">{{ prevTotal | valueFilter }}</td>
              </tr>
            </template>
            <template #item="{ item }">
              <tr>
                <td>{{ item.number }}</td>
                <td>{{ item.name }}</td>
                <td class="text-right text-no-wrap">
                  {{ item.programmings | valueFilter }}
                </td>
                <td class="text-right text-no-wrap">
                  {{ item.pre_programmings | valueFilter }}
                </td>
                <td class="text-right text-no-wrap">
                  {{ item.prevision | valueFilter }}
                </td>
              </tr>
            </template>
            <template #body.append="">
              <tr class="grey lighten-4 font-weight-medium">
                <td colspan="2" class="text-center">Total</td>
                <td class="text-right">{{ prgTotal | valueFilter }}</td>
                <td class="text-right">{{ prePrgTotal | valueFilter }}</td>
                <td class="text-right">{{ prevTotal | valueFilter }}</td>
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
  </v-card>
</template>

<script>
import { excelExport, valStyle } from './Utils/excelExport'
import * as types from '../store/mutation-types'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'PrevPreProg',
  data () {
    return {
      search: '',
      year: new Date().getFullYear(),
      headers: [
        { text: 'Numéro', value: 'number' },
        { text: 'Nom', value: 'name' },
        { text: 'Programmé', value: 'programmings', align: 'right' },
        { text: 'Préprogrammé', value: 'pre_programmings', align: 'right' },
        { text: 'Prévision', value: 'prevision', align: 'right' }
      ]
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      prgYears: state => state.programmings.programmingsYears,
      items: state => state.summaries.progPrevisions
    }),
    prgTotal () {
      return this.items.reduce((a, c) => a + c.programmings, 0)
    },
    prePrgTotal () {
      return this.items.reduce((a, c) => a + c.pre_programmings, 0)
    },
    prevTotal () {
      return this.items.reduce((a, c) => a + c.prevision, 0)
    }
  },
  methods: {
    download () {
      if (!this.items.length) return
      const lines = this.items.map(l => ({
        number: l.number,
        name: l.name,
        category_name: l.category_name,
        chapter_code: l.chapter_code,
        programmings: l.programmings * 0.01,
        pre_programmings: l.pre_programmings * 0.01,
        prevision: l.prevision * 0.01
      }))
      const columns = [
        { header: 'Numéro d\'opération', key: 'number', width: 8 },
        { header: 'Nom de l\'opération', key: 'name', width: 50 },
        { header: 'Chap', key: 'chapter_code', width: 8 },
        { header: 'Cat', key: 'category_name', width: 10 },
        { header: 'Programmation', key: 'programmings', ...valStyle },
        { header: 'Préprogrammation', key: 'pre_programmings', ...valStyle },
        { header: 'Prévision', key: 'prevision', ...valStyle }
      ]
      excelExport(lines, columns, 'Programmation prévision')
    }
  },
  created () {
    this.$store.dispatch(types.GET_PROGRAMMATION_PREVISION, { year: this.year })
    this.$store.dispatch(types.GET_PROGRAMMINGS_YEARS)
  },
  watch: {
    year (y) {
      this.$store.dispatch(types.GET_PROGRAMMATION_PREVISION, { year: y })
    }
  }
}
</script>
