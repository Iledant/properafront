<template>
  <v-card>
    <v-card-title class="secondary">
      <v-icon class="mr-2 black--text">playlist_add</v-icon>
      <div class="title">{{ title }}</div>
    </v-card-title>
    <v-card-text>
      <v-layout row wrap class="mb-3" align-center>
        <v-flex xs6>
          <v-icon class="mr-2">work</v-icon>
          <span class="text-subtitle-1">Liste des opérations</span>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            label="Recherche"
            single-line
            hide-details
            v-model="opSearch"
            prepend-icon="search"
          />
        </v-flex>
      </v-layout>
      <v-data-table
        :headers="opHeaders"
        :items="opList"
        class="elevation-1"
        :loading="isLoading"
        :search="opSearch"
        no-data-text="Aucune opération trouvée"
        no-results-text="Aucune opération trouvée"
      >
        <template #item="{ item }">
          <td>
            <v-btn icon text small class="ma-0" @click.stop="onOpAdd(item)">
              <v-icon color="secondary">add</v-icon>
            </v-btn>
            {{ item.name }}
          </td>
          <td class="text-right">{{ item.y0 | valueFilter }}</td>
          <td class="text-right">{{ item.y1 | valueFilter }}</td>
          <td class="text-right">{{ item.y2 | valueFilter }}</td>
          <td class="text-right">{{ item.y3 | valueFilter }}</td>
          <td class="text-right">{{ item.y4 | valueFilter }}</td>
        </template>
      </v-data-table>
      <v-layout row wrap class="mb-3 mt-2" align-center>
        <v-flex xs6>
          <v-icon class="mr-2">playlist_add</v-icon>
          <span class="text-subtitle-1">Scénario</span>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            prepend-icon="search"
            label="Recherche"
            single-line
            hide-details
            v-model="scenarioSearch"
          />
        </v-flex>
      </v-layout>
      <v-data-table
        :headers="scenarioHeaders"
        :items="scenarioItems"
        class="elevation-1"
        :loading="isLoading"
        :search="scenarioSearch"
        no-data-text="Pas de contenu"
        no-results-text="Recherche infructueuse"
      >
        <template #item="{ item }">
          <td>
            <v-btn icon text small class="ma-0" @click="onScenarioDel(item)" color="error">
              <v-icon>delete</v-icon>
            </v-btn>
            {{ item.name }}
          </td>
          <td>
            <input
              type="number"
              size="3"
              min="0"
              max="5"
              v-model="item.offset"
              style="outline: 0; text-align: right;"
              @input="onChange(item)"
            />
          </td>

          <td class="text-right">{{ item.y0 | valueFilter }}</td>
          <td class="text-right">{{ item.y1 | valueFilter }}</td>
          <td class="text-right">{{ item.y2 | valueFilter }}</td>
          <td class="text-right">{{ item.y3 | valueFilter }}</td>
          <td class="text-right">{{ item.y4 | valueFilter }}</td>
        </template>
        <template #body.append>
          <tr class="lime lighten-4">
            <td>Total</td>
            <td></td>
            <td class="text-right">{{ scenarioTotal[0] | valueFilter }}</td>
            <td class="text-right">{{ scenarioTotal[1] | valueFilter }}</td>
            <td class="text-right">{{ scenarioTotal[2] | valueFilter }}</td>
            <td class="text-right">{{ scenarioTotal[3] | valueFilter }}</td>
            <td class="text-right">{{ scenarioTotal[4] | valueFilter }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn color="primary" text @click="onDownload" :disabled="modified">Export Excel</v-btn>
      <v-btn
        color="primary"
        text
        @click="onPerBudgetActionDownload"
        :disabled="modified"
      >Export Excel par action</v-btn>
      <v-spacer />
      <v-btn color="primary" text @click="onCancel" :disabled="!modified">Annuler</v-btn>
      <v-btn color="primary" text @click="onSave" :disabled="!modified">Sauver</v-btn>
    </v-card-actions>
    <v-divider />
    <v-layout row wrap xs12>
      <v-flex xs12 class="ml-3 mt-3">
        <span class="text-subtitle-1">Simulation de chronique de CP avec prévisions manuelles</span>
      </v-flex>
      <v-flex xs6>
        <v-select
          class="xs12 md6 ml-4 pr-2"
          :items="paymentTypes"
          v-model="paymentPrevTypeId"
          label="Chronique pour la prévision"
          single-line
          item-text="name"
          item-value="id"
          persistent-hint
        />
      </v-flex>
      <v-flex xs6 class="text-right">
        <v-btn
          color="primary"
          text
          @click="onScenarioCPDownload"
          :disabled="modified || paymentPrevTypeId === null"
        >Export Excel</v-btn>
      </v-flex>
      <v-flex xs12 class="ml-3 mt-4">
        <span class="text-subtitle-1">Simulation de chronique de CP purement statistique</span>
      </v-flex>
      <v-flex xs6>
        <v-select
          class="xs12 md6 ml-4 pr-2"
          :items="paymentTypes"
          v-model="paymentPrevTypeId"
          label="Chronique pour la prévision"
          single-line
          item-text="name"
          item-value="id"
          persistent-hint
        />
      </v-flex>
      <v-flex xs6 class="text-right">
        <v-btn
          color="primary"
          text
          @click="onScenarioStatisticalCPDownload"
          :disabled="modified || paymentPrevTypeId === null"
        >Export Excel</v-btn>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import * as types from '@/store/mutation-types'
import { excelExport } from '@/components/Utils/excelExport'

export default {
  name: 'scenario',
  computed: {
    opCrossList () {
      return this.$store.state.scenarios.operationCrossTable
    },
    opList () {
      return this.opCrossList.map(o => {
        const r = { id: o.id, name: o.number + '-' + o.name }
        for (const k in o) {
          if (k[0] === 'y') r[k] = o[k]
        }
        return r
      })
    },
    isLoading () {
      return this.$store.getters.loading
    },
    scenarios () {
      return this.$store.state.scenarios.scenarioCrossTable
    },
    title () {
      return this.$route.params.scenario_name
    },
    paymentTypes () {
      return this.$store.state.paymentRatios.paymentTypes
    }
  },
  data: () => ({
    opHeaders: [
      { text: 'Opération', value: 'name', align: 'center', sortable: true },
      { text: '2017', value: 'y0', align: 'center', sortable: true },
      { text: '2018', value: 'y1', align: 'center', sortable: true },
      { text: '2019', value: 'y2', align: 'center', sortable: true },
      { text: '2020', value: 'y3', align: 'center', sortable: true },
      { text: '2021', value: 'y4', align: 'center', sortable: true }
    ],
    scenarioItems: [],
    scenarioTotal: [0, 0, 0, 0, 0],
    scenarioHeaders: [
      { text: 'Nom', value: 'name', align: 'center', sortable: true },
      { text: 'Décalage', value: 'offset', align: 'center', sortable: true },
      { text: '2017', value: 'y0', align: 'center', sortable: true },
      { text: '2018', value: 'y1', align: 'center', sortable: true },
      { text: '2019', value: 'y2', align: 'center', sortable: true },
      { text: '2020', value: 'y3', align: 'center', sortable: true },
      { text: '2021', value: 'y4', align: 'center', sortable: true }
    ],
    opSearch: '',
    scenarioSearch: '',
    modified: false,
    actualYear: new Date().getFullYear(),
    paymentPrevTypeId: null
  }),
  methods: {
    onCancel () {
      this.$store.dispatch(types.GET_SCENARIO_DATA, {
        scenarioId: this.$route.params.scenario_id,
        firstYear: this.actualYear
      })
      this.modified = false
    },
    onSave () {
      const offsetList = []
      this.scenarioItems.forEach(i => {
        offsetList.push({ offset: i.offset, physical_op_id: i.physical_op_id })
      })
      this.$store.dispatch(types.SET_SCENARIO_DATA, {
        id: this.$route.params.scenario_id,
        offsetList: offsetList
      })
      this.modified = false
    },
    onChange (item) {
      const offset = Number(item.offset)
      item.offset = isNaN(offset) ? 0 : offset
      const prevYears = {
        y0: item.y0,
        y1: item.y1,
        y2: item.y2,
        y3: item.y3,
        y4: item.y4
      }
      item.years = this.computeYears(item.initialPrevs, item)
      for (let i = 0; i < 5; i++) {
        const currentTotal = this.scenarioTotal[i]
        this.scenarioTotal.splice(
          i,
          1,
          currentTotal + item['y' + i] - prevYears['y' + i]
        )
      }
      this.modified = true
    },
    onDownload () {
      let lines = null
      const years = []
      const keys = Object.keys(this.scenarios[0])
      keys.forEach(k => {
        if (/y\d+/.test(k)) {
          years.push(k)
        }
      })
      if (this.scenarios.length > 0) {
        lines = this.scenarios.map(l => {
          const formattedLine = {
            number: l.number,
            name: l.name,
            offset: l.offset
          }
          for (let i = 0; i < years.length; i++) {
            formattedLine[years[i]] =
              i - l.offset >= 0
                ? l[years[i - l.offset]]
                  ? Number(l[years[i - l.offset]]) * 0.01
                  : 0
                : 0
          }
          return formattedLine
        })
      }
      const columns = [
        { header: 'Numéro d\'opération', key: 'number', width: 14 },
        { header: 'Intitulé d\'opération', key: 'name', width: 50 },
        { header: 'Décalage', key: 'offset', width: 10 }
      ]
      for (let i = 0; i < years.length; i++) {
        columns.push({
          header: String(this.actualYear + i),
          key: years[i],
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        })
      }
      excelExport(lines, columns, 'Scenario')
    },
    onPerBudgetActionDownload () {
      this.$store.dispatch(types.DOWNLOAD_BUDGET_SCENARIO, {
        scenarioId: this.$route.params.scenario_id,
        firstYear: this.actualYear
      })
    },
    onScenarioCPDownload () {
      this.$store.dispatch(types.DOWNLOAD_SCENARIO_PAYMENT_PER_ACTION, {
        firstYear: this.actualYear + 1,
        defaultPaymentTypeId: this.paymentPrevTypeId,
        scenarioId: this.$route.params.scenario_id
      })
    },
    onScenarioStatisticalCPDownload () {
      this.$store.dispatch(
        types.DOWNLOAD_SCENARIO_STATISTICAL_PAYMENT_PER_ACTION,
        {
          firstYear: this.actualYear + 1,
          defaultPaymentTypeId: this.paymentPrevTypeId,
          scenarioId: this.$route.params.scenario_id
        }
      )
    },
    computeYears (initialPrevs, line) {
      const offset = line.offset
      if (initialPrevs) {
        for (let i = 0; i < initialPrevs.length; i++) {
          line['y' + i] = i >= offset ? initialPrevs[i - offset] : 0
        }
      }
    },
    convertYearsColumnsToArray (s) {
      return [
        Number(s.y0 || 0),
        Number(s.y1 || 0),
        Number(s.y2 || 0),
        Number(s.y3 || 0),
        Number(s.y4 || 0),
        Number(s.y5 || 0)
      ]
    },
    onOpAdd (item) {
      const found = this.scenarioItems.find(s => s.physical_op_id === item.id)
      if (!found) {
        const initialPrevs = this.convertYearsColumnsToArray(item)
        this.scenarioItems.push({
          physical_op_id: item.id,
          name: item.name,
          offset: 0,
          initialPrevs: initialPrevs,
          years: initialPrevs
        })
        for (let i = 0; i < 5; i++) {
          const currentTotal = this.scenarioTotal[i]
          this.scenarioTotal.splice(i, 1, currentTotal + initialPrevs[i])
        }
        this.modified = true
      }
    },
    onScenarioDel (item) {
      for (let i = 0; i < 5; i++) {
        const currentTotal = this.scenarioTotal[i]
        this.scenarioTotal.splice(i, 1, currentTotal - item['y' + i])
      }
      this.scenarioItems.splice(this.scenarioItems.indexOf(item), 1)
      this.modified = true
    }
  },
  created () {
    this.$store.dispatch(types.GET_SCENARIO_DATA, {
      scenarioId: this.$route.params.scenario_id,
      firstYear: this.actualYear
    })
    this.$store.dispatch(types.GET_PAYMENT_TYPES)
  },
  watch: {
    opCrossList () {
      for (let i = 1; i <= 5; i++) {
        this.opHeaders[i].text = String(this.actualYear + i - 1)
        this.scenarioHeaders[i + 1].text = String(this.actualYear + i - 1)
      }
    },
    scenarios (list) {
      this.scenarioItems = []
      this.scenarioTotal = [0, 0, 0, 0, 0]
      list.forEach(s => {
        const years = this.convertYearsColumnsToArray(s)
        this.computeYears(years, s)
        this.scenarioItems.push({
          physical_op_id: s.id,
          name: s.number + ' - ' + s.name,
          offset: s.offset,
          y0: s.y0,
          y1: s.y1,
          y2: s.y2,
          y3: s.y3,
          y4: s.y4,
          initialPrevs: years
        })
        for (let i = 0; i < 5; i++) {
          this.scenarioTotal[i] += s['y' + i]
        }
      })
    }
  }
}
</script>
