<template>
  <v-card>
    <v-card-text>
      <v-Layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-select
            :items="paymentTypes"
            v-model="typeId"
            label="Chronique utilisée pour les CP calculés Région"
            single-line
            item-text="name"
            item-value="id"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="items"
            dense
            hide-default-footer
            hide-default-header
            :items-per-page="-1"
            :loading="loading"
          >
            <template v-slot:body.prepend="">
              <tr class="green lighten-3">
                <td></td>
                <td rowspan="2" class="text-center">Total</td>
                <td>AP Région</td>
                <td class="text-right">{{ totalCommitment | valueFilter }}</td>
                <td>AP totales</td>
                <td class="text-right">{{ totalTotalCommitment | valueFilter }}</td>
              </tr>
              <tr class="green lighten-3">
                <td></td>
                <td>CP Région</td>
                <td class="text-right">{{ totalPayment | valueFilter }}</td>
                <td>CP calculés Région</td>
                <td class="text-right">{{ totalPrevPayment | valueFilter }}</td>
              </tr>
              <tr class="green lighten-4">
                <td></td>
                <td rowspan="2" class="text-center">Années précédentes</td>
                <td>AP Région</td>
                <td class="text-right">{{ pastCommitments | valueFilter }}</td>
                <td>AP totales</td>
                <td>non disponibles</td>
              </tr>
              <tr class="green lighten-4">
                <td></td>
                <td>CP Région</td>
                <td class="text-right">{{ pastPayments | valueFilter }}</td>
                <td>CP calculés Région</td>
                <td class="text-right">{{ totalPrevPayment | valueFilter }}</td>
              </tr>

              <tr class="green lighten-5">
                <td></td>
                <td rowspan="2" class="text-center">Année en cours</td>
                <td>AP Région</td>
                <td class="text-right">{{ (thisYearCommitments + pendingCommitment) | valueFilter }}</td>
                <td>AP totales</td>
                <td>non disponibles</td>
              </tr>
              <tr class="green lighten-5">
                <td></td>
                <td>CP Région</td>
                <td class="text-right">{{ thisYearPayments | valueFilter }}</td>
                <td>CP calculés Région</td>
                <td>non disponibles</td>
              </tr>
            </template>

            <template v-slot:item="{ item }">
              <tr :class="item.id % 2 ? 'green lighten-5' : 'green lighten-4'">
                <td class="pl-0 pr-0" rowspan="4">
                  <v-tooltip right v-if="item.year === maxYear">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        text
                        x-small
                        icon
                        class="ma-0"
                        @click="onRemoveLast"
                        v-on="on"
                        color="error"
                      >
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Supprimer l'année</span>
                  </v-tooltip>
                </td>
                <td rowspan="4" class="text-center">{{ item.year }}</td>
                <td>AP Région</td>
                <td class="text-right">
                  <v-text-field
                    :readonly="isObserver"
                    single-line
                    hide-details
                    v-currency
                    reverse
                    v-model="item.fmtCmt"
                    @blur="comUpdate(item)"
                    class="body-2 pt-0"
                  />
                </td>
                <td>AP totales</td>
                <td class="text-right">
                  <v-text-field
                    :readonly="isObserver"
                    single-line
                    hide-details
                    v-currency
                    reverse
                    v-model="item.fmtTotCmt"
                    @blur="totalComUpdate(item)"
                    class="body-2 pt-0"
                  />
                </td>
              </tr>
              <tr :class="item.id % 2 ? 'green lighten-5' : 'green lighten-4'">
                <td>Clé AP Région</td>
                <td class="text-right">{{ item.regionRatio | percentage }}</td>
                <td>CP Région</td>
                <td class="text-right">
                  <v-text-field
                    :readonly="isObserver"
                    single-line
                    hide-details
                    v-currency
                    reverse
                    v-model="item.fmtPmt"
                    @blur="payUpdate(item)"
                    class="body-2 pt-0"
                  />
                </td>
              </tr>
              <tr :class="item.id % 2 ? 'green lighten-5' : 'green lighten-4'">
                <td>Clé AP État</td>
                <td class="text-right">
                  <v-text-field
                    v-model="item.fmtStateRatio"
                    single-line
                    hide-details
                    v-percentage-input
                    reverse
                    prefix="%"
                    @change="stateRatioUpdate(item)"
                    :disabled="isObserver"
                    class="body-2 pt-0"
                  />
                </td>
                <td>CP calculés Région</td>
                <td class="text-right">{{ prevPayment[item.id] | valueFilter }}</td>
              </tr>
              <tr :class="item.id % 2 ? 'green lighten-5' : 'green lighten-4'">
                <td colspan="2">
                  <v-textarea
                    class="body-2"
                    auto-grow
                    rows="1"
                    label="Commentaire pour l'engagement"
                    single-line
                    v-model="item.commitmentDescript"
                    @change="modified = true"
                  />
                </td>
                <td colspan="2">
                  <v-textarea
                    class="body-2"
                    auto-grow
                    rows="1"
                    label="Commentaire pour la prévision spécifique CP"
                    single-line
                    v-model="item.paymentDescript"
                    @change="modified = true"
                  />
                </td>
              </tr>
            </template>

            <template v-slot:body.append="">
              <tr class="green lighten-3">
                <td></td>
                <td rowspan="2" class="text-center">Total</td>
                <td>Engagements Région</td>
                <td class="text-right">{{ totalCommitment | valueFilter }}</td>
                <td>Engagements totaux</td>
                <td class="text-right">{{ totalTotalCommitment | valueFilter }}</td>
              </tr>
              <tr class="green lighten-3">
                <td></td>
                <td>CP Région</td>
                <td class="text-right">{{ totalPayment | valueFilter }}</td>
                <td>CP calculés Région</td>
                <td class="text-right">{{ totalPrevPayment | valueFilter }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-Layout>
    </v-card-text>
    <v-card-actions v-if="!isObserver" class="tertiary">
      <v-btn color="primary" small text @click="onAddClick">Ajouter</v-btn>
      <v-spacer />
      <v-btn color="primary" small text @click="onCancel" v-show="modified">Annuler</v-btn>
      <v-btn color="primary" small text @click="onSave" v-show="modified">Valider</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as types from '../../store/mutation-types.js'
import isObserver from '../Mixins/isObserver'
import currencyInput from '../Mixins/currencyInput'
import { percentageInput, percentageInputParse } from '../../filters/filters'

export default {
  name: 'OpPrevisions',
  props: { op: Object },
  mixins: [isObserver, currencyInput],
  data: () => ({
    modified: false,
    minYear: new Date().getFullYear(),
    maxYear: 0,
    prevPayment: [],
    totalPrevPayment: 0,
    items: [],
    typeId: null,
    headers: [
      { text: '', value: '', align: 'center', sortable: false, width: '1%' },
      { text: 'Année', value: 'year', align: 'center', sortable: false },
      { text: 'Catégorie', value: 'cat1', align: 'center', sortable: false },
      { text: 'Montant', value: 'value1', align: 'center', sortable: false },
      { text: 'Catégorie', value: 'cat2', align: 'center', sortable: false },
      { text: 'Montant', value: 'value2', align: 'center', sortable: false }
    ]
  }),
  methods: {
    comUpdate (item) {
      const parseCmt = this.parseCurrency(item.fmtCmt)
      if (item.commitment !== parseCmt) {
        item.commitment = parseCmt
        item.regionRatio = item.totalCommitment
          ? item.commitment / item.totalCommitment
          : null
        this.modified = true
        this.prevPaymentCompute()
      }
    },
    totalComUpdate (item) {
      const parseTotCmt = this.parseCurrency(item.fmtTotCmt)
      if (item.totalCommitment !== parseTotCmt) {
        item.totalCommitment = parseTotCmt
        item.regionRatio = item.totalCommitment
          ? item.commitment / item.totalCommitment
          : null
        this.modified = true
      }
    },
    payUpdate (item) {
      const parsePmt = this.parseCurrency(item.fmtPmt)
      if (item.payment !== parsePmt) {
        item.payment = parsePmt
        this.modified = true
      }
    },
    stateRatioUpdate (item) {
      const parseStateRatio = percentageInputParse(item.fmtStateRatio)
      if (item.stateRatio !== parseStateRatio) {
        item.stateRatio = parseStateRatio
        this.modified = true
      }
    },
    onCancel () {
      this.items = []
      this.minYear = new Date().getFullYear()
      this.maxYear = 0
      this.$store.dispatch(types.GET_ONLY_PREVISIONS, { id: this.op.id })
      this.modified = false
    },
    onSave () {
      const commitmentList = []
      const paymentList = []
      this.items.forEach(p => {
        commitmentList.push({
          value: p.commitment || 0,
          total_value: p.totalCommitment,
          state_ratio: p.stateRatio,
          year: p.year,
          descript: p.commitmentDescript
        })
        paymentList.push({
          value: p.payment || 0,
          year: p.year,
          descript: p.paymentDescript
        })
      })
      this.$store.dispatch(types.SET_PREVISIONS, {
        id: this.op.id,
        PrevCommitment: commitmentList,
        PrevPayment: paymentList
      })
      this.modified = false
    },
    onAddClick () {
      if (this.maxYear === 0) {
        this.maxYear = new Date().getFullYear()
        this.minYear = this.maxYear
      } else this.maxYear++
      this.items.splice(this.items.length, 0, {
        year: this.maxYear,
        commitment: 0,
        fmtCmt: '',
        totalCommitment: null,
        fmtTotCmt: '',
        regionRatio: null,
        stateRatio: null,
        fmtStateRatio: '',
        payment: 0,
        commitmentDescript: null,
        paymentDescript: null
      })
      this.modified = true
      this.prevPaymentCompute()
    },
    onRemoveLast () {
      if (this.items.length > 0) {
        this.items.pop()
        this.maxYear--
        this.modified = true
        this.prevPaymentCompute()
      }
    },
    prevPaymentCompute () {
      let minYear = this.maxYear
      this.fcList.forEach(fc => {
        minYear = Math.min(minYear, Number(fc.date.slice(0, 4)))
      })
      const commitmentArray = Array(this.maxYear - minYear + 1).fill(0)
      const paymentArray = Array(this.maxYear - minYear + 1).fill(0)
      this.fcList.forEach(fc => {
        const year = Number(fc.date.slice(0, 4))
        commitmentArray[year - minYear] += fc.value
      })
      this.items.forEach(i => {
        commitmentArray[i.year - minYear] = i.commitment
      })

      const prLength = this.paymentRatios.length
      const caLength = commitmentArray.length
      for (let i = 0; i < prLength; i++) {
        for (let j = 0; j < caLength; j++) {
          if (i + j < caLength) {
            paymentArray[i + j] +=
              this.paymentRatios[i].ratio * commitmentArray[j]
          }
        }
      }
      this.prevPayment = []
      this.totalPrevPayment = this.pastPayments
      for (let i = this.minYear; i <= this.maxYear; i++) {
        const yearPayment = paymentArray[i - minYear]
        this.prevPayment.push(yearPayment)
        this.items[i - this.minYear].prevPayment = yearPayment
        this.totalPrevPayment += yearPayment
      }
    },
    computeItems () {
      this.maxYear = this.prevCommitments.reduce(
        (y, cmt) => Math.max(y, cmt.year),
        0
      )
      this.maxYear = this.prevPayments.reduce(
        (y, pmt) => Math.max(y, pmt.year),
        this.maxYear
      )
      this.items = []
      for (let y = this.minYear; y <= this.maxYear; y++) {
        const yc = this.prevCommitments.find(p => p.year === y) || {
          value: 0,
          descript: null
        }
        const yp = this.prevPayments.find(p => p.year === y) || {
          value: 0,
          descript: null
        }
        this.items.push({
          id: y - this.minYear,
          year: y,
          commitment: yc.value,
          fmtCmt: this.formatCurrency(yc.value),
          totalCommitment: yc.total_value,
          fmtTotCmt: this.formatCurrency(yc.total_value),
          regionRatio: yc.total_value
            ? Number(yc.value / yc.total_value)
            : null,
          stateRatio: yc.state_ratio ? Number(yc.state_ratio) : null,
          fmtStateRatio: percentageInput(yc.state_ratio),
          payment: yp.value,
          fmtPmt: this.formatCurrency(yp.value),
          commitmentDescript: yc.descript,
          paymentDescript: yp.descript
        })
      }
    }
  },
  computed: {
    prevCommitments () {
      return this.$store.state.previsions.prevCommitmentList
    },
    prevPayments () {
      return this.$store.state.previsions.prevPaymentList
    },
    pendingCommitment () {
      return this.$store.state.previsions.opPendingCommitment
    },
    paymentList () {
      return this.$store.state.previsions.paymentList
    },
    thisYearCommitments () {
      return this.fcList.reduce(
        (acc, fc) =>
          acc + (Number(fc.date.slice(0, 4)) === this.minYear ? fc.value : 0),
        0
      )
    },
    thisYearPayments () {
      return this.paymentList.reduce(
        (acc, p) =>
          acc + (Number(p.date.slice(0, 4)) === this.minYear ? p.value : 0),
        0
      )
    },
    loading () {
      return this.$store.getters.loading
    },
    fcList () {
      return this.$store.state.previsions.fcList
    },
    pastCommitments () {
      return this.fcList
        ? this.fcList.reduce((a, b) => a + b.value, 0)
        : 0 - this.thisYearCommitments
    },
    pastPayments () {
      return this.paymentList
        ? this.paymentList.reduce((a, b) => a + b.value, 0)
        : 0 - this.thisYearPayments
    },
    totalCommitment () {
      return this.items.reduce((a, b) => a + b.commitment, this.pastCommitments)
    },
    totalTotalCommitment () {
      return this.items.reduce((a, b) => a + (b.totalCommitment || 0), 0)
    },
    totalPayment () {
      return this.items.reduce((a, b) => a + b.payment, this.pastPayments)
    },
    paymentTypes () {
      return this.$store.state.paymentRatios.paymentTypes
    },
    paymentRatios () {
      return this.$store.state.paymentRatios.paymentRatios
    },
    paymentLastDate () {
      return this.$store.state.importLog.paymentLastDate
    },
    commitmentLastDate () {
      return this.$store.state.importLog.commitmentLastDate
    }
  },
  watch: {
    typeId (newId) {
      this.$store.dispatch(types.GET_PAYMENT_RATIOS, { id: newId })
    },
    paymentRatios () {
      this.prevPaymentCompute()
    },
    prevCommitments () {
      this.prevPaymentCompute()
    },
    prevPayments: { handler: 'computeItems', immediate: true }
  }
}
</script>
