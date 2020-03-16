<template>
  <v-card>
    <v-card-title class="secondary">Prévisions pluriannuelles</v-card-title>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
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
                <td>Total</td>
                <td class="text-right text-no-wrap">
                  {{ y0Total | valueFilter }}
                </td>
                <td class="text-right text-no-wrap">
                  {{ y1Total | valueFilter }}
                </td>
                <td class="text-right text-no-wrap">
                  {{ y2Total | valueFilter }}
                </td>
                <td class="text-right text-no-wrap">
                  {{ y3Total | valueFilter }}
                </td>
                <td class="text-right text-no-wrap">
                  {{ y4Total | valueFilter }}
                </td>
              </tr>
            </template>
            <template #item="{ item }">
              <tr>
                <td>{{ item.number }} - {{ item.name }}</td>
                <td
                  class="text-right text-no-wrap"
                >{{ item.y0 ? item.y0.value : null | valueFilter }}</td>
                <td
                  class="text-right text-no-wrap"
                >{{ item.y1 ? item.y1.value : null | valueFilter }}</td>
                <td
                  class="text-right text-no-wrap"
                >{{ item.y2 ? item.y2.value : null | valueFilter }}</td>
                <td
                  class="text-right text-no-wrap"
                >{{ item.y3 ? item.y3.value : null | valueFilter }}</td>
                <td
                  class="text-right text-no-wrap"
                >{{ item.y4 ? item.y4.value : null | valueFilter }}</td>
              </tr>
            </template>
            <template #body.append="">
              <tr class="grey lighten-4 font-weight-medium">
                <td>Total</td>
                <td class="text-right text-no-wrap">
                  {{ y0Total | valueFilter }}
                </td>
                <td class="text-right text-no-wrap">
                  {{ y1Total | valueFilter }}
                </td>
                <td class="text-right text-no-wrap">
                  {{ y2Total | valueFilter }}
                </td>
                <td class="text-right text-no-wrap">
                  {{ y3Total | valueFilter }}
                </td>
                <td class="text-right text-no-wrap">
                  {{ y4Total | valueFilter }}
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
import { excelExport, getExcelColumnName, valStyle, percentStyle } from '@/components/Utils/excelExport'
import * as types from '@/store/mutation-types'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'MultiAnnualPrev',
  data () {
    return {
      year: new Date().getFullYear(),
      search: '',
      headers: [
        { text: 'Opération', value: 'name' },
        { value: 'y1', align: 'right' },
        { value: 'y2', align: 'right' },
        { value: 'y3', align: 'right' },
        { value: 'y4', align: 'right' },
        { value: 'y5', align: 'right' }
      ],
      actualYear: new Date().getFullYear(),
      y0Total: 0,
      y1Total: 0,
      y2Total: 0,
      y3Total: 0,
      y4Total: 0
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      items: state => state.summaries.multiannualProg
    })
  },
  methods: {
    download () {
      if (!this.items.length) return
      const keys = Object.keys(this.items[0])
      const years = keys.filter(k => /y\d+/.test(k))
      const lines = this.items.map(l => {
        const formattedLine = {
          number: l.number,
          name: l.name,
          step_name: l.step_name,
          category_name: l.category_name,
          state_value: ''
        }
        for (const y of years) {
          formattedLine[y + 'value'] = l[y] ? l[y].value * 0.01 : 0
          formattedLine[y + 'total_value'] = l[y]
            ? l[y].total_value * 0.01
            : 0
          formattedLine[y + 'state_ratio'] = l[y] ? l[y].state_ratio : 0
        }
        return formattedLine
      })
      const columns = [
        { header: 'Numéro', key: 'number', width: 10 },
        { header: 'Nom', key: 'name', width: 50 },
        { header: 'Étape', key: 'step_name', width: 8 },
        { header: 'Cat', key: 'category_name', width: 8 }
      ]
      let colNum = 5
      for (let i = 0; i < years.length; i++) {
        const colTotalName = getExcelColumnName(colNum)
        const colStateName = getExcelColumnName(colNum + 1)
        columns.push({
          header: String(this.actualYear + i + '\n Montant région'),
          key: years[i] + 'value',
          ...valStyle
        })
        columns.push({
          header: String(this.actualYear + i + '\n Montant total'),
          key: years[i] + 'total_value',
          ...valStyle
        })
        columns.push({
          header: String(this.actualYear + i + '\n Clé État'),
          key: years[i] + 'state_ratio',
          ...percentStyle
        })
        columns.push({
          header: String(this.actualYear + i + '\n Montant État'),
          key: years[i] + 'state_value',
          formula: `=IF(AND(${colTotalName}£<>"",${colStateName}£<>""),${colTotalName}£*${colStateName}£,"")`,
          width: 14,
          style: {
            numberFormat: '#,##0.00',
            wrapText: true,
            rightBorder: { style: 'thin' }
          },
          addTotal: true
        })
        colNum += 4
      }
      excelExport(lines, columns, 'Programmation pluriannuelle')
    }
  },
  watch: {
    items (list) {
      this.y0Total = 0
      this.y1Total = 0
      this.y2Total = 0
      this.y3Total = 0
      this.y4Total = 0
      list.forEach(p => {
        this.y0Total += p.y0 ? Number(p.y0.value) : 0
        this.y1Total += p.y1 ? Number(p.y1.value) : 0
        this.y2Total += p.y2 ? Number(p.y2.value) : 0
        this.y3Total += p.y3 ? Number(p.y3.value) : 0
        this.y4Total += p.y4 ? Number(p.y4.value) : 0
      })
    }
  },
  created () {
    this.$store.dispatch(types.GET_MULTIANNUAL_PROGRAMMATION, {
      firstYear: this.actualYear
    })
    for (let i = 1; i <= 5; i++) {
      this.headers[i].text = this.actualYear + i - 1
    }
  }
}
</script>
