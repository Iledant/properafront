<template>
  <v-card>
    <v-card-title class="secondary">
      Programmation de l'année {{ programmingsYear ? programmingsYear : '' }}
    </v-card-title>
    <v-alert :value="!commissions" error>
      La programmation nécessite au moins une commission (Menu administration)
    </v-alert>
    <v-container grid-list-md fluid v-show="commissions">
      <v-layout row wrap>
        <v-flex xs12 sm6>
          <v-text-field
            label="Année"
            hide-details
            :value="year"
            prepend-icon="calendar_today"
            v-debounce:500ms="changeYear"
            :rules="[yearRule]"
          />
        </v-flex>
        <v-flex xs12 sm6>
          <v-text-field
            label="Recherche"
            single-line
            hide-details
            v-model="search"
            prepend-icon="search"
          />
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            dense
            :items="programmingsItems"
            class="elevation-1"
            :loading="loading"
            :search="search"
            no-data-text="Aucune programmation trouvée"
            no-results-text="Recherche infructueuse"
          >
            <template #body.prepend="">
              <tr class="grey lighten-4 font-weight-medium">
                <td>Total</td>
                <td class="text-right font-italic">
                  <v-tooltip right color="primary">
                    <template v-slot:activator="{ on }">
                      <div v-on="on">{{ previsionTotal | valueFilter }}</div>
                    </template>
                    <span>
                      Le total est calculé à partir de la base de données.<br />
                      Il ne tient pas compte des lignes doublonnées dans la
                      programmation.
                    </span>
                  </v-tooltip>
                </td>
                <td />
                <td class="text-right">{{ preProgTotal | valueFilter }}</td>
                <td />
                <td />
                <td class="text-right">{{ progTotal | valueFilter }}</td>
                <td />
              </tr>
            </template>
            <template #item="{ item }">
              <tr>
                <td>{{ item.name }}</td>
                <td class="text-right">
                  <v-tooltip right color="primary">
                    <template #activator="{ on }">
                      <div v-on="on" class="text-no-wrap">
                        {{ item.prevision | valueFilter }}
                      </div>
                    </template>
                    Total : {{ item.total_prevision | valueFilter }}<br />
                    Clé État: {{ item.state_ratio_prevision | percentage }}<br />
                  </v-tooltip>
                </td>
                <td class="px-0">
                  <v-tooltip right color="primary">
                    <template #activator="{ on }">
                      <v-btn
                        v-on="on"
                        small
                        text
                        icon
                        class="ma-0"
                        color="secondary"
                        @click.stop="copyPrev(item)"
                      >
                        <v-icon>redo</v-icon>
                      </v-btn>
                    </template>
                    <span>Recopier la prévision pour la programmation</span>
                  </v-tooltip>
                </td>
                <td class="text-right">
                  <v-tooltip right color="primary">
                    <template #activator="{ on }">
                      <div v-on="on" class="text-no-wrap">
                        {{ item.pre_prog_value | valueFilter }}
                      </div>
                    </template>
                    Date de commission :
                    {{ item.pre_prog_commission_date | dateFilter }}<br />
                    Commission :
                    {{ item.pre_prog_commission_name || '' }}<br />
                    Total :
                    {{ item.total_pre_prog_total_value | valueFilter }}<br />
                    Clé État :
                    {{ item.pre_prog_state_ratio | percentage }}<br />
                    Description :
                    {{ item.pre_prog_descript ? item.pre_prog_descript : '-' }}
                  </v-tooltip>
                </td>
                <td class="px-0">
                  <v-tooltip right color="primary">
                    <template #activator="{ on }">
                      <v-btn
                        v-on="on"
                        small
                        text
                        icon
                        class="ma-0"
                        color="secondary"
                        @click.stop="copyPreProg(item)"
                      >
                        <v-icon>redo</v-icon>
                      </v-btn>
                    </template>
                    <span>Recopier la préprogrammation pour la programmation</span>
                  </v-tooltip>
                </td>
                <td class="px-0">
                  <v-tooltip right color="primary">
                    <template #activator="{ on }">
                      <v-btn
                        v-on="on"
                        small
                        text
                        icon
                        class="ma-0"
                        color="secondary"
                        @click.stop="copyLine(item)"
                      >
                        <v-icon>subdirectory_arrow_left</v-icon>
                      </v-btn>
                    </template>
                    <span>Nouvelle programmation pour l'année</span>
                  </v-tooltip>
                </td>
                <td
                  class="text-right primary--text table-link"
                  @click="modify(item)"
                >
                  <v-tooltip right color="primary">
                    <template #activator="{ on }">
                      <div v-on="on" class="text-no-wrap">
                        {{ item.value | valueFilter }}
                      </div>
                    </template>
                    Total : {{ item.total_value | valueFilter }}<br />
                    Clé État: {{ item.state_ratio | percentage }}<br />
                  </v-tooltip>
                </td>
                <td
                  class="primary--text table-link"
                  @click="modify(item)"
                >{{ item.commission_name }}</td>
              </tr>
            </template>
            <template #body.append="">
              <tr class="grey lighten-4 font-weight-medium">
                <td>Total</td>
                <td class="text-right font-italic">
                  <v-tooltip right color="primary">
                    <template v-slot:activator="{ on }">
                      <div v-on="on">{{ previsionTotal | valueFilter }}</div>
                    </template>
                    <span>
                      Le total est calculé à partir de la base de données.<br />
                      Il ne tient pas compte des lignes doublonnées dans la
                      programmation.
                    </span>
                  </v-tooltip>
                </td>
                <td></td>
                <td class="text-right">{{ preProgTotal | valueFilter }}</td>
                <td></td>
                <td></td>
                <td class="text-right">{{ progTotal | valueFilter }}</td>
                <td></td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-btn text color="primary" @click="download">Export Excel</v-btn>
      <v-spacer v-show="programmingsModified" />
      <v-btn text color="primary" @click="onCancel" v-show="programmingsModified">
        Annuler
      </v-btn>
      <v-btn text color="primary" @click="onSave" v-show="programmingsModified" >
        Sauver
      </v-btn>
    </v-card-actions>

    <v-dialog v-model="dlg" max-width="600px" persistent>
      <v-card>
        <v-card-title class="secondary title">
          {{ modifiedItem ? modifiedItem.name : '' }}
        </v-card-title>
        <v-container grid-list-md fluid>
          <v-layout wrap align-baseline>
            <v-flex xs12 class="caption">
              <span class="font-weight-medium">Plan : </span>
              {{ modifiedItem ? modifiedItem.plan_name : '-' }}<br />
              <span class="font-weight-medium">Ligne de plan : </span>
              {{ modifiedItem ? modifiedItem.plan_line_name : '-' }}<br />
              <span class="font-weight-medium">Montant Région : </span>
              {{ planLineValue | valueFilter }} ({{ planLineRegionRatio | percentage}})<br />
              <span class="font-weight-medium">Montant total : </span>
              {{ planLineTotalValue | valueFilter }}<br />
            </v-flex>
            <v-flex xs6>
              <v-text-field
                reverse
                v-model="fmtPrgVal"
                label="Programmation"
                v-currency
              />
            </v-flex>
            <v-flex xs6>
              <v-autocomplete
                :items="commissionItems"
                v-model="programmingsCommissionId"
                item-text="name"
                item-value="commission_id"
                hide-details
              />
            </v-flex>
            <v-flex xs6>
              <v-text-field
                v-model="fmtTotPrgVal"
                label="Programmation totale"
                reverse
                v-currency
              />
            </v-flex>
            <v-flex xs6>soit {{ regionRatio | percentage }} Région</v-flex>
            <v-flex xs6>
              <v-text-field
                v-model="stateRatio"
                label="Clé État"
                suffix="%"
                :rules="[isNullOrPercentage]"
                reverse
              />
            </v-flex>
            <v-flex xs6 class="pl-3">soit {{ stateValue | valueFilter }}</v-flex>
          </v-layout>
        </v-container>
        <v-card-actions class="tertiary">
          <v-spacer />
          <v-btn text color="primary" @click="dlg = false"> Annuler</v-btn>
          <v-btn text color="error" @click="prgDelete">Supprimer</v-btn>
          <v-btn text color="primary" @click="prgModify">Modifier</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import * as types from '@/store/mutation-types'
import { dateFilter } from '../filters/filters'
import yearRule from '@/components/Mixins/yearRule'
import currencyInput from '@/components/Mixins/currencyInput'
import { excelExport, dateStyle, valStyle, percentStyle } from './Utils/excelExport'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'Programming',
  mixins: [yearRule, currencyInput],
  data: () => ({
    search: '',
    programmingsModified: false,
    modifiedItem: null,
    dlg: false,
    fmtPrgVal: '',
    fmtTotPrgVal: '',
    programmingsItem: null,
    stateRatio: null,
    programmingsCommissionId: null,
    year: new Date().getFullYear(),
    programmingsYear: new Date().getFullYear(),
    programmingsItems: [],
    headers: [
      { text: 'Opération', value: 'name' },
      { text: 'Besoin', align: 'right', value: 'prevision' },
      { text: '', value: '', sortable: false, width: '1%' },
      { text: 'Préprog.', align: 'right', value: 'pre_prog_value' },
      { text: '', value: '', sortable: false, width: '1%' },
      { text: '', value: '', sortable: false, width: '1%' },
      { text: 'Prog.', align: 'right', value: 'value' },
      { text: 'Commission', value: 'commission_date' }
    ],
    preProgTotal: 0,
    progTotal: 0,
    totalProgrammingsTotal: 0
  }),
  methods: {
    getProgrammings () {
      this.$store.dispatch(types.GET_PROGRAMMINGS, {
        year: this.programmingsYear
      })
    },
    onCancel () {
      this.getProgrammings()
      this.programmingsModified = false
    },
    onSave () {
      const pList = []
      this.programmingsItems.forEach(i => {
        if (i.value && i.commission_id) {
          pList.push({
            physical_op_id: i.physical_op_id,
            commission_id: i.commission_id,
            value: i.value,
            total_value: i.total_value,
            state_ratio: i.state_ratio,
            year: this.programmingsYear
          })
        }
      })
      this.$store
        .dispatch(types.SET_PROGRAMMINGS, {
          Programmings: pList,
          year: this.programmingsYear
        })
        .then((this.programmingsModified = false))
    },
    changeYear (y) {
      this.year = y
      if (!this.disabled) {
        this.programmingsYear = parseInt(y)
        this.getProgrammings()
      }
    },
    modify (item) {
      this.modifiedItem = item
      this.fmtPrgVal = this.formatCurrency(item.value)
      this.programmingsCommissionId = item.commission_id
      this.fmtTotPrgVal = this.formatCurrency(item.total_value)
      this.stateRatio = item.state_ratio ? String(item.state_ratio * 100) : null
      this.dlg = true
    },
    totalsCompute () {
      this.progTotal = 0
      this.preProgTotal = 0
      this.totalProgrammingsTotal = 0
      this.programmingsItems.forEach(p => {
        this.progTotal += p.value ? p.value : 0
        this.totalProgrammingsTotal += p.total_value ? p.value : 0
        this.preProgTotal += p.pre_prog_value ? p.pre_prog_value : 0
      })
    },
    prgModify () {
      this.modifiedItem.commission_id = this.programmingsCommissionId
      this.modifiedItem.value = this.parseCurrency(this.fmtPrgVal)
      this.modifiedItem.total_value = this.parseCurrency(this.fmtTotPrgVal)
      this.modifiedItem.state_ratio = this.stateRatio
        ? this.stateRatio.replace(/,/, '.') / 100
        : null
      const commission = this.commissions.find(
        c => c.id === this.modifiedItem.commission_id
      )
      this.modifiedItem.commission_date = commission.date
      this.modifiedItem.commission_name = commission.name
      this.dlg = false
      this.programmingsModified = true
      this.totalsCompute()
    },
    prgDelete () {
      this.modifiedItem.commission_id = null
      this.modifiedItem.value = null
      this.modifiedItem.total_value = null
      this.modifiedItem.state_ratio = null
      this.modifiedItem.commission_date = null
      this.modifiedItem.commission_name = null
      this.dlg = false
      this.programmingsModified = true
      this.totalsCompute()
    },
    copyPrev (item) {
      this.modifiedItem = item
      this.fmtPrgVal = this.formatCurrency(item.prevision)
      this.programmingsCommissionId = item.commission_id
      this.totalValue = this.formatCurrency(item.total_prevision)
      this.stateRatio = item.state_ratio_prevision
        ? String(item.state_ratio_prevision * 100)
        : null
      this.dlg = true
    },
    copyLine (item) {
      this.$store.commit(types.NEW_NEGATIVE_ID)
      this.programmingsItems.push({
        id: this.$store.state.ids.negativeId,
        physical_op_id: item.physical_op_id,
        name: item.name,
        plan_name: item.plan_name,
        plan_line_name: item.plan_line_name,
        plan_line_value: item.plan_line_value,
        plan_line_total_value: item.plan_line_total_value,
        prevision: item.prevision,
        total_prevision: item.total_prevision,
        region_state_prevision: item.region_state_prevision,
        state_ratio_prevision: item.state_ratio_prevision,
        pre_prog_value: item.pre_prog_value,
        pre_prog_commission_id: item.pre_prog_commission_id,
        pre_prog_total_value: item.pre_prog_total_value,
        pre_prog_state_ratio: item.pre_prog_state_ratio,
        pre_prog_descript: item.pre_prog_descript,
        pre_prog_commission_date: item.pre_prog_commission_date,
        pre_prog_commission_name: item.pre_prog_commission_name,
        commission_id: null,
        commission_date: null,
        commission_name: null,
        value: null,
        total_value: null,
        state_ratio: null
      })
    },
    copyPreProg (item) {
      this.modifiedItem = item
      this.fmtPrgVal = this.formatCurrency(item.pre_prog_value)
      this.programmingsCommissionId = item.pre_prog_commission_id
      this.fmtTotPrgVal = this.formatCurrency(item.pre_prog_total_value)
      this.stateRatio = item.pre_prog_state_ratio
        ? String(item.pre_prog_state_ratio * 100)
        : null
      this.dlg = true
    },
    isNullOrPercentage (input) {
      return (
        !input || /100|^\d?\d((\.|,)\d+)?$/.test(input) || 'Pourcentage attendu'
      )
    },
    download () {
      const lines = this.programmingsItems.map(l => ({
        name: l.name,
        plan_name: l.plan_name,
        plan_line_name: l.plan_line_name,
        plan_line_value: l.plan_line_value,
        plan_line_total_value: l.plan_line_total_value,
        prevision: l.prevision ? l.prevision * 0.01 : 0,
        total_prevision: l.total_prevision ? l.total_prevision * 0.01 : 0,
        state_ratio_prevision: l.state_ratio_prevision,
        pre_prog_value: l.pre_prog_value ? l.pre_prog_value * 0.01 : 0,
        pre_prog_total_value: l.pre_prog_total_value ? l.pre_prog_total_value * 0.01 : 0,
        pre_prog_state_ratio: l.pre_prog_state_ratio,
        pre_prog_descript: l.pre_prog_descript,
        pre_prog_commission_date: l.pre_prog_commission_date,
        commission_date: new Date(l.commission_date),
        prog_value: l.value ? l.value * 0.01 : 0,
        prog_total_value: l.total_value ? l.total_value * 0.01 : 0,
        state_ratio: l.state_ratio
      }))
      const columns = [
        { header: 'Opération', key: 'name', width: 30 },
        { header: 'Besoin Région', key: 'prevision', ...valStyle },
        { header: 'Besoin total', key: 'total_prevision', ...valStyle },
        { header: 'Besoin clé Etat', key: 'state_ratio_prevision', ...percentStyle },
        { header: 'Préprog Région', key: 'pre_prog_value', ...valStyle },
        { header: 'Préprog date', key: 'pre_prog_commission_date', ...dateStyle },
        { header: 'Préprog total', key: 'pre_prog_total_value', ...valStyle },
        { header: 'Préprog clé Etat', key: 'pre_prog_state_ratio', ...percentStyle },
        { header: 'Préprog comment', key: 'pre_prog_state_descript', width: 20 },
        { header: 'Prog Région', key: 'prog_value', ...valStyle },
        { header: 'Prog date', key: 'commission_date', ...dateStyle },
        { header: 'Prog total', key: 'prog_total_value', ...valStyle },
        { header: 'Prog clé Etat', key: 'state_ratio', ...percentStyle },
        {
          header: 'Montant État',
          key: 'stateValue',
          formula: '=IF(AND(L£<>"",M£<>""),L£*M£,"")',
          ...valStyle
        },
        { header: 'Plan', key: 'plan_name', width: 30 },
        { header: 'Ligne de plan', key: 'plan_line_name', width: 30 },
        { header: 'Montant ligne', key: 'plan_line_value', ...valStyle },
        { header: 'Montant tot. ligne', key: 'plan_line_total_value', ...valStyle }
      ]
      excelExport(lines, columns, 'Programmation ' + this.programmingsYear)
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      opList: state => state.physops.opsWithPrevisions,
      programmings: state => state.programmings.programmings,
      commissions: state => state.programmings.commissions,
      previsionTotal: state => state.programmings.prevCommitmentTotal
    }),
    disabled () {
      return (
        this.programmingsModified ||
        !/^20\d\d$/.test(this.year) ||
        this.programmingsYear === this.year
      )
    },
    commissionItems () {
      return this.commissions
        .filter(c => c.date.includes(this.programmingsYear))
        .map(c => ({
          commission_id: c.id,
          name: dateFilter(c.date) + ' : ' + c.name
        }))
    },
    regionRatio () {
      return this.fmtTotPrgVal !== '' && this.fmtPrgVal !== ''
        ? this.$parseCurrency(this.fmtPrgVal) / this.$parseCurrency(this.fmtTotPrgVal)
        : null
    },
    stateValue () {
      return this.fmtTotPrgVal !== '' && this.stateRatio
        ? this.$parseCurrency(this.fmtTotPrgVal) *
            Number.parseFloat(this.stateRatio.replace(/,/, '.'))
        : null
    },
    planLineValue () {
      return this.modifiedItem ? this.modifiedItem.plan_line_value : null
    },
    planLineTotalValue () {
      return this.modifiedItem ? this.modifiedItem.plan_line_total_value : null
    },
    planLineRegionRatio () {
      return this.modifiedItem && this.modifiedItem.plan_line_total_value
        ? this.modifiedItem.plan_line_value /
            this.modifiedItem.plan_line_total_value
        : null
    }
  },
  created () {
    this.$store.dispatch(types.GET_COMMISSIONS)
    this.getProgrammings()
  },
  watch: {
    programmings (list) {
      this.programmingsItems = []
      this.progTotal = 0
      this.totalProgrammingsTotal = 0
      this.preProgTotal = 0
      list.forEach(p => {
        const commission = this.commissions.find(c => c.id === p.commission_id)
        const preProgCommission = this.commissions.find(c => c.id === p.pre_prog_commission_id)
        this.progTotal += p.value || 0
        this.totalProgrammingsTotal += p.total_value || 0
        this.preProgTotal += p.pre_prog_value || 0
        this.programmingsItems.push({
          id: p.id,
          physical_op_id: p.physical_op_id,
          name: p.op_number + ' - ' + p.op_name,
          plan_name: p.plan_name,
          plan_line_name: p.plan_line_name,
          plan_line_value: p.plan_line_value,
          plan_line_total_value: p.plan_line_total_value,
          prevision: p.prevision,
          total_prevision: p.total_prevision,
          state_ratio_prevision: p.state_ratio_prevision,
          pre_prog_value: p.pre_prog_value,
          pre_prog_total_value: p.pre_prog_total_value,
          pre_prog_state_ratio: p.pre_prog_state_ratio,
          pre_prog_descript: p.pre_prog_descript,
          pre_prog_commission_id: p.pre_prog_commission_id,
          pre_prog_commission_date: preProgCommission ? new Date(preProgCommission.date) : null,
          pre_prog_commission_name: preProgCommission ? preProgCommission.name : null,
          commission_id: p.commission_id,
          commission_date: commission ? new Date(commission.date) : null,
          commission_name: commission ? commission.name : null,
          value: p.value,
          total_value: p.total_value,
          state_ratio: p.state_ratio
        })
      })
    }
  }
}
</script>
