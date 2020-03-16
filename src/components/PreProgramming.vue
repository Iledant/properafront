<template>
  <v-card>
    <v-card-title class="secondary">
      Pré-programmation de l'année {{ programmingsYear ? programmingsYear : '' }}
    </v-card-title>
    <v-alert :value="!commissions" error>
      La pré-programmation nécessite au moins une commission (Menu administration)
    </v-alert>
    <v-container grid-list-md fluid v-show="commissions">
      <v-layout row wrap>
        <v-flex xs12 sm6>
          <v-text-field
            label="Année (taper pour la changer)"
            hide-details
            v-debounce:500ms="changeYear"
            :value="year"
            :rules="[yearRule]"
            prepend-icon="calendar_today"
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
            :items="items"
            class="elevation-1"
            dense
            :loading="loading"
            :search="search"
            no-data-text="Aucune programmation trouvée"
            no-results-text="Recherche infructueuse"
          >
            <template #body.prepend="">
              <tr class="grey lighten-4 font-weight-medium">
                <td>Total</td>
                <td class="text-right">{{ previsionTotal | valueFilter }}</td>
                <td />
                <td class="text-right">{{ preProgTotal | valueFilter }}</td>
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
                        {{ item.prev_value | valueFilter }}
                      </div>
                    </template>
                    <ul>
                      <li>Total : {{ item.prev_total_value | valueFilter }}</li>
                      <li>Clé État: {{ item.prev_state_ratio | percentage }}</li>
                    </ul>
                  </v-tooltip>
                </td>
                <td class="tx-0">
                  <v-tooltip right color="primary">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-on="on"
                        small
                        text
                        icon
                        class="ma-0"
                        color="secondary"
                        @click.stop="onCopyPrevision(item)"
                      >
                        <v-icon>redo</v-icon>
                      </v-btn>
                    </template>
                    <span>Recopier le besoin pour la pré-programmation</span>
                  </v-tooltip>
                </td>
                <td
                  class="text-right primary--text table-link"
                  @click="onModifyProgrammingItem(item)"
                >
                  <v-tooltip right color="primary">
                    <template #activator="{ on }">
                      <div v-on="on" class="text-no-wrap">
                        {{ item.pre_prog_value | valueFilter }}
                      </div>
                    </template>
                    <ul>
                      <li>Total : {{ item.pre_prog_total_value | valueFilter }}</li>
                      <li>Clé État: {{ item.pre_prog_state_ratio | percentage }}</li>
                      <li>
                        Description :
                        {{ item.pre_prog_descript ? item.pre_prog_descript : '-' }}
                      </li>
                    </ul>
                  </v-tooltip>
                </td>
                <td
                  class="text-right primary--text table-link"
                  @click="onModifyProgrammingItem(item)"
                >
                  {{ item.commission_name }}
                </td>
              </tr>
            </template>
            <template #body.append="">
              <tr class="grey lighten-4 font-weight-medium">
                <td>Total</td>
                <td class="text-right">{{ previsionTotal | valueFilter }}</td>
                <td />
                <td class="text-right">{{ preProgTotal | valueFilter }}</td>
                <td />
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions v-show="programmingsModified" class="tertiary">
      <v-spacer />
      <v-btn text color="primary" @click="onCancel">Annuler</v-btn>
      <v-btn text color="primary" @click="onSave">Sauver</v-btn>
    </v-card-actions>

    <v-dialog v-model="programmingDlg" max-width="600px" persistent>
      <v-card>
        <v-card-title class="secondary">
          {{ modifiedItem ? modifiedItem.name : '' }}
        </v-card-title>
        <v-container grid-list-md fluid>
          <v-layout wrap align-baseline>
            <v-flex xs12>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Plan</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ modifiedItem ? modifiedItem.plan_name : '-' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Ligne de plan</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ modifiedItem ? modifiedItem.plan_line_name : '-' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Montant Région</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ planLineValue | valueFilter }} ({{
                      planLineRegionRatio | percentage
                      }})
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Montant total</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ planLineTotalValue | valueFilter }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-flex>
            <v-flex xs4>
              <v-text-field
                reverse label="Préprogrammation"
                v-model="fmtPrgVal"
                v-currency
              />
            </v-flex>
            <v-flex xs8>
              <v-autocomplete
                :items="commissionItems"
                v-model="programmingsCommissionId"
                item-text="name"
                item-value="commission_id"
                hide-details
              />
            </v-flex>
            <v-flex xs4>
              <v-text-field
                v-model="fmtTotPrgVal"
                label="Programmation totale"
                reverse
                v-currency
              />
            </v-flex>
            <v-flex xs8>soit {{ regionRatio | percentage }} Région</v-flex>
            <v-flex xs4>
              <v-text-field
                v-model="stateRatio"
                label="Clé État"
                prefix="%"
                :rules="[isNullOrPercentage]"
                reverse
              />
            </v-flex>
            <v-flex xs8 class="pl-3">soit {{ stateValue | valueFilter }}</v-flex>
          </v-layout>
        </v-container>
        <v-card-actions class="tertiary">
          <v-spacer />
          <v-btn text color="primary" @click="programmingDlg = false">Annuler</v-btn>
          <v-btn text color="error" @click="onProgrammingDelete">Supprimer</v-btn>
          <v-btn
            text
            color="primary"
            @click="onProgrammingModify"
            :disabled="modifyDisabled"
          >Modifier</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog persistent max-width="600px" v-model="grandMotherDlg">
      <v-card>
        <v-card-title class="primary white--text">
          Le conseil de Grand Mère
        </v-card-title>
        <v-container grid-list-md fluid>
          <v-layout wrap>
            <v-flex xs6><v-img src="grandmother.svg" /></v-flex>
            <v-flex xs6>
              <P>Jérôme</P>
              <p>As-tu bien vérifié tes chiffres cette-fois-ci ?</p>
              <p>parce que la dernière fois...</p>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions class="tertiary">
          <v-spacer />
          <v-btn text small @click="grandMotherDlg = false">Oui oui !</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import * as types from '../store/mutation-types'
import { dateFilter } from '../filters/filters'
import currencyInput from './Mixins/currencyInput'
import yearRule from './Mixins/yearRule'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'PreProgramming',
  mixins: [yearRule, currencyInput],
  data: () => ({
    search: '',
    programmingsModified: false,
    modifiedItem: null,
    programmingDlg: false,
    fmtPrgVal: '',
    fmtTotPrgVal: '',
    stateRatio: null,
    programmingsCommissionId: null,
    grandMotherDlg: false,
    year: new Date().getFullYear(),
    programmingsYear: new Date().getFullYear(),
    items: [],
    headers: [
      { text: 'Opération', value: 'name' },
      { text: 'Besoin', align: 'right', value: 'prev_value' },
      { text: '', value: '', sortable: false, width: '1%' },
      { text: 'Préprogrammation', align: 'right', value: 'pre_prog_value' },
      { text: 'Commission', align: 'right', value: 'commission_date' }
    ],
    previsionTotal: 0,
    preProgTotal: 0
  }),
  methods: {
    getPreProgrammings () {
      this.$store.dispatch(types.GET_PRE_PROGRAMMINGS, {
        year: this.programmingsYear
      })
    },
    onCancel () {
      this.getPreProgrammings()
      this.programmingsModified = false
    },
    onSave () {
      if (this.user.name.toUpperCase().includes('CHIASSON')) {
        this.grandMotherDlg = true
      }
      const pList = this.items.filter(
        i => i.pre_prog_value && i.pre_prog_commission_id
      )
      pList.forEach(i => {
        if (i.pre_prog_id < 0) i.pre_prog_id = null
      })
      this.$store
        .dispatch(types.SET_PRE_PROGRAMMINGS, {
          PreProgrammings: pList,
          year: this.programmingsYear
        })
        .then((this.programmingsModified = false))
    },
    changeYear (y) {
      this.year = y
      if (!this.disabled) {
        this.programmingsYear = parseInt(y)
        this.getPreProgrammings()
      }
    },
    onModifyProgrammingItem (item) {
      this.modifiedItem = item
      this.fmtPrgVal = this.formatCurrency(item.pre_prog_value)
      this.programmingsCommissionId = item.pre_prog_commission_id
      this.fmtTotPrgVal = this.formatCurrency(item.pre_prog_total_value)
      this.stateRatio = item.pre_prog_state_ratio
        ? String(item.pre_prog_state_ratio * 100)
        : null
      this.programmingDlg = true
    },
    totalsCompute () {
      this.previsionTotal = 0
      this.preProgTotal = 0
      this.items.forEach(p => {
        this.previsionTotal += p.prev_value || 0
        this.preProgTotal += p.pre_prog_value || 0
      })
    },
    onProgrammingModify () {
      this.modifiedItem.pre_prog_commission_id = this.programmingsCommissionId
      this.modifiedItem.pre_prog_value = this.parseCurrency(this.fmtPrgVal)
      this.modifiedItem.pre_prog_total_value = this.parseCurrency(this.fmtTotPrgVal)
      this.modifiedItem.pre_prog_state_ratio = this.stateRatio
        ? this.stateRatio.replace(/,/, '.') / 100
        : null
      const commission = this.commissions.find(
        c => c.id === this.programmingsCommissionId
      )
      this.modifiedItem.commission_date = commission.date
      this.modifiedItem.commission_name = commission.name
      this.modifiedItem.pre_prog_year = this.programmingsYear
      this.programmingDlg = false
      this.programmingsModified = true
      this.totalsCompute()
    },
    onProgrammingDelete () {
      this.modifiedItem.pre_prog_commission_id = null
      this.modifiedItem.pre_prog_value = null
      this.modifiedItem.pre_prog_total_value = null
      this.modifiedItem.pre_prog_state_ratio = null
      this.modifiedItem.commission_date = null
      this.modifiedItem.commission_name = null
      this.modifiedItem.pre_prog_year = this.programmingsYear
      this.programmingDlg = false
      this.programmingsModified = true
      this.totalsCompute()
    },
    onCopyPrevision (item) {
      this.modifiedItem = item
      this.fmtPrgVal = this.formatCurrency(item.prev_value)
      this.programmingsCommissionId = null
      this.fmtTotPrgVal = this.formatCurrency(item.prev_total_value)
      this.stateRatio = item.prev_state_ratio
        ? String(item.prev_state_ratio * 100)
        : null
      this.programmingDlg = true
    },
    isNullOrPercentage (input) {
      return (
        !input || /100|^\d?\d((\.|,)\d+)?$/.test(input) || 'Pourcentage attendu'
      )
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      preProgrammings: state => state.preProgrammings.preProgrammings,
      commissions: state => state.programmings.commissions,
      user: state => state.token.user
    }),
    disabled () {
      return (
        this.programmingsModified ||
        !/^20\d\d$/.test(this.year) ||
        this.programmingsYear === parseInt(this.year)
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
    },
    modifyDisabled () {
      return !this.programmingsCommissionId || this.fmtPrgVal === ''
    }
  },
  created () {
    this.$store.dispatch(types.GET_COMMISSIONS)
    this.getPreProgrammings()
  },
  watch: {
    preProgrammings (list) {
      this.items = []
      this.previsionTotal = 0
      this.preProgTotal = 0
      list.forEach(p => {
        const commission = this.commissions.find(
          c => c.id === p.pre_prog_commission_id
        )
        this.previsionTotal += p.prevision ? p.prevision : 0
        this.preProgTotal += p.pre_prog_value ? p.pre_prog_value : 0
        this.items.push({
          pre_prog_id: p.pre_prog_id,
          physical_op_id: p.physical_op_id,
          name: p.physical_op_number + ' - ' + p.physical_op_name,
          plan_name: p.plan_name,
          plan_line_name: p.plan_line_name,
          plan_line_value: p.plan_line_value,
          plan_line_total_value: p.plan_line_total_value,
          prev_value: p.prev_value,
          prev_total_value: p.prev_total_value,
          prev_state_ratio: p.prev_state_ratio,
          pre_prog_value: p.pre_prog_value,
          pre_prog_total_value: p.pre_prog_total_value,
          pre_prog_state_ratio: p.pre_prog_state_ratio,
          pre_prog_descript: p.pre_prog_descript,
          pre_prog_year: p.pre_prog_year,
          pre_prog_commission_id: p.pre_prog_commission_id,
          commission_date: commission ? new Date(commission.date) : null,
          commission_name: commission ? commission.name : null
        })
      })
    }
  }
}
</script>
