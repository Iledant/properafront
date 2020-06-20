<template>
  <v-card>
    <v-card-title class="secondary">Préparation de plan</v-card-title>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 sm6>
          <v-text-field
            label="Première année"
            v-debounce:500ms="handleFirstYear"
            prepend-icon="calendar_today"
            :rules="[yearRule]"
          />
        </v-flex>
        <v-flex xs12 sm6>
          <v-text-field
            label="Dernière année"
            v-debounce:500ms="handleLastYear"
            prepend-icon="calendar_today"
            :rules="[yearRule, lastYearRule]"
          />
        </v-flex>
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
                <td colspan="2">Total</td>
                <td class="text-right text-no-wrap">
                  {{ totalValue | valueFilter }}
                </td>
                <td class="text-right text-no-wrap">
                  {{ value | valueFilter }}
                </td>
              </tr>
            </template>
            <template #item="{ item }">
              <tr>
                <td>{{ item.number }}</td>
                <td>{{ item.name }}</td>
                <td
                  class="text-right text-no-wrap"
                >{{ item.total_prev[0] ? item.total_prev[0] : null | valueFilter }}</td>
                <td
                  class="text-right text-no-wrap"
                >{{ item.prev[0] ? item.prev[0] : null | valueFilter }}</td>
              </tr>
            </template>
            <template #body.append="">
              <tr class="grey lighten-4 font-weight-medium">
                <td colspan="2">Total</td>
                <td class="text-right text-no-wrap">
                  {{ totalValue | valueFilter }}
                </td>
                <td class="text-right text-no-wrap">
                  {{ value | valueFilter }}
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
  </v-card>
</template>

<script>
import { excelExport, valStyle, dateStyle, percentStyle } from '@/components/Utils/excelExport'
import * as types from '@/store/mutation-types'
import yearRule from '@/components/Mixins/yearRule'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'PlanForecasts',
  mixins: [yearRule],
  data () {
    return {
      firstYear: null,
      lastYear: null,
      search: '',
      headers: [
        { text: 'Numéro', value: 'number' },
        { text: 'Nom', value: 'name' },
        { value: 'total_value', align: 'right' },
        { value: 'value', align: 'right' }
      ],
      totalValue: 0,
      value: 0
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      items: state => state.summaries.planForecasts
    }),
    disabled () {
      return (
        !this.checkYear(this.firstYear) ||
        !this.checkYear(this.lastYear) ||
        this.lastYear < this.firstYear
      )
    }
  },
  methods: {
    handleFirstYear (y) {
      this.firstYear = y
      this.getPlanForecasts()
    },
    handleLastYear (y) {
      this.lastYear = y
      this.getPlanForecasts()
    },
    checkYear (y) {
      return /^20\d{2}$/.test(y)
    },
    lastYearRule (y) {
      return (this.checkYear(this.firstYear) && this.checkYear(y) &&
        parseInt(y) >= parseInt(this.firstYear)) ||
        'Doit être supérieure à la première'
    },
    getPlanForecasts () {
      if (!this.disabled) {
        this.$store.dispatch(types.GET_PLAN_FORECASTS,
          { firstYear: this.firstYear, lastYear: this.lastYear })
      }
    },
    download () {
      if (!this.items.length) return
      const colNum = this.items[0].total_prev.length
      const lines = this.items.map(l => {
        const formattedLine = {
          number: l.number,
          name: l.name,
          step_name: l.step_name,
          category_name: l.category_name,
          tri: l.tri,
          van: l.van,
          valuedate: l.valuedate,
          r75: l.r75,
          r77: l.r77,
          r78: l.r78,
          r91: l.r91,
          r92: l.r92,
          r93: l.r93,
          r94: l.r94,
          r95: l.r95
        }
        for (let i = 0; i < colNum; i++) {
          formattedLine['ty' + i] = l.total_prev[i] * 0.01
        }
        for (let i = 0; i < colNum; i++) {
          formattedLine['y' + i] = l.prev[i] * 0.01
        }
        return formattedLine
      })
      const columns = [
        { header: 'Numéro', key: 'number', width: 10 },
        { header: 'Nom', key: 'name', width: 50 },
        { header: 'Étape', key: 'step_name', width: 12 },
        { header: 'Cat', key: 'category_name', width: 12 },
        { header: 'TRI', key: 'tri', width: 8, ...percentStyle },
        { header: 'VAN', key: 'van', ...valStyle },
        { header: 'Date val', key: 'valuedate', ...dateStyle },
        { header: 'Coef 75', key: 'r75', ...percentStyle },
        { header: 'Coef 77', key: 'r77', ...percentStyle },
        { header: 'Coef 78', key: 'r78', ...percentStyle },
        { header: 'Coef 91', key: 'r91', ...percentStyle },
        { header: 'Coef 92', key: 'r92', ...percentStyle },
        { header: 'Coef 93', key: 'r93', ...percentStyle },
        { header: 'Coef 94', key: 'r94', ...percentStyle },
        { header: 'Coef 95', key: 'r95', ...percentStyle }
      ]
      for (let i = 0; i < colNum; i++) {
        const year = parseInt(this.firstYear) + i
        columns.push({ header: 'Total ' + year, key: 'ty' + i, ...valStyle })
      }
      for (let i = 0; i < colNum; i++) {
        const year = parseInt(this.firstYear) + i
        columns.push({ header: 'Région ' + year, key: 'y' + i, ...valStyle })
      }
      excelExport(lines, columns, 'Préparation plan')
    }
  },
  watch: {
    items (list) {
      list.forEach(p => {
        this.totalValue += p.total_prev[0] ? Number(p.total_prev[0]) : 0
        this.Value += p.prev[0] ? Number(p.prev[0]) : 0
      })
    }
  }
}
</script>
