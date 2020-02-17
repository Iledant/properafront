<template>
  <v-card>
    <v-card-title class="secondary title">
      <v-icon class="mr-2 black--text">view_list</v-icon>
      Plan : « {{ plan ? plan.name : '-' }} »
    </v-card-title>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field prepend-icon="search" label="Recherche" v-model="search" />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="items"
            class="elevation-1"
            :loading="loading"
            :search="search"
            no-data-text="Aucune ligne de plan"
            no-results-text="Aucun résultat"
            dense
          >
            <template v-slot:body.prepend="">
              <tr class="grey lighten-4 font-weight-medium">
                <td colspan="3" class="text-center">Total</td>
                <td class="text-right text-no-wrap">{{ total_valueTotal | valueFilter }}</td>
                <td class="text-right text-no-wrap">{{ valueTotal | valueFilter }}</td>
                <td class="text-right text-no-wrap">{{ commitmentTotal | valueFilter }}</td>
                <td class="text-right text-no-wrap">{{ programmingsTotal | valueFilter }}</td>
                <td class="text-right text-no-wrap">{{ prevTotal | valueFilter }}</td>
              </tr>
            </template>
            <template v-slot:item="{item}">
              <tr>
                <td class="px-0">
                  <v-tooltip right color="error">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        class="ma-0"
                        @click="onRemove(item)"
                        color="error"
                        v-if="isAdmin"
                        v-on="on"
                      >
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Supprimer</span>
                  </v-tooltip>
                </td>
                <td class="px-0">
                  <v-tooltip right color="primary">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        class="ma-0"
                        @click="onEdit(item)"
                        color="secondary"
                        v-if="isAdmin"
                        v-on="on"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </template>
                    <span>Modifier</span>
                  </v-tooltip>
                </td>
                <td>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <div v-on="on">{{ item.name }}</div>
                    </template>
                    Description : {{ item.descript || '-' }}
                  </v-tooltip>
                </td>
                <td class="text-right text-no-wrap">{{ item.total_value | valueFilter }}</td>
                <td class="text-right text-no-wrap">{{ item.value | valueFilter }}</td>
                <td class="text-right text-no-wrap">{{ item.commitment | valueFilter }}</td>
                <td class="text-right text-no-wrap">{{ item.programmings | valueFilter }}</td>
                <td class="text-right text-no-wrap">{{ item.prev | valueFilter }}</td>
              </tr>
            </template>
            <template v-slot:body.append="">
              <tr class="grey lighten-4 font-weight-medium">
                <td colspan="3" class="text-center">Total</td>
                <td class="text-right text-no-wrap">{{ total_valueTotal | valueFilter }}</td>
                <td class="text-right text-no-wrap">{{ valueTotal | valueFilter }}</td>
                <td class="text-right text-no-wrap">{{ commitmentTotal | valueFilter }}</td>
                <td class="text-right text-no-wrap">{{ programmingsTotal | valueFilter }}</td>
                <td class="text-right text-no-wrap">{{ prevTotal | valueFilter }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn text small color="primary" @click="onDetailedDownload">Détail Excel</v-btn>
      <v-btn text small color="primary" @click="onDownload">Export Excel</v-btn>
      <v-btn text small color="primary" @click.stop="onCreate" v-if="isAdmin">Ajouter</v-btn>
    </v-card-actions>

    <plan-line-edit-dlg
      :mentions="mentions"
      :planline="modifiedPlanLine"
      v-model="showDlg"
      @save="onSave"
    />

    <delete-dlg
      v-model="removeDlg"
      cat="la ligne"
      :name="deletedPlanLine ? deletedPlanLine.name : ''"
      @confirm="onConfirmRmv"
    />
  </v-card>
</template>

<script>
import * as types from '../store/mutation-types.js'
import isAdmin from './Mixins/isAdmin'
import PlanLineEditDlg from './PlanLines/PlanLineEditDlg'
import DeleteDlg from './DeleteDlg.vue'
import { excelExport } from './Utils/excelExport'

export default {
  name: 'PlanLines',
  mixins: [isAdmin],
  props: ['plan_id'],
  components: { PlanLineEditDlg, DeleteDlg },
  data: () => ({
    items: [],
    headers: [
      { text: '', value: '', align: 'center', sortable: false, width: '1%' },
      { text: '', value: '', align: 'center', sortable: false, width: '1%' },
      { text: 'Nom', value: 'name', align: 'center' },
      { text: 'Montant total', value: 'total_value', align: 'center' },
      { text: 'Montant Région', value: 'value', align: 'center' },
      { text: 'Engagements', value: 'commitment', align: 'center' },
      { text: 'Programmé', value: 'programmings', align: 'center' },
      { text: 'Prévisions', value: 'prev', align: 'center' }
    ],
    search: '',
    deletedPlanLine: null,
    removeDlg: false,
    modified: false,
    showDlg: false,
    modifiedPlanLine: null,
    mentions: { title: 'Nouvelle ligne de plan', validate: 'Créer' },
    total_valueTotal: 0,
    valueTotal: 0,
    commitmentTotal: 0,
    programmingsTotal: 0,
    prevTotal: 0
  }),
  computed: {
    plan () {
      const numberId = Number(this.plan_id)
      return this.$store.state.plans.plans.find(p => p.id === numberId)
    },
    planLines () {
      return this.$store.state.planLines.planLines
    },
    detailedPlanLines () {
      return this.$store.state.planLines.detailedPlanLines
    },
    beneficiaryList () {
      return this.$store.state.planLines.planLineBeneficiaries
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    onCreate () {
      this.mentions = { title: 'Nouvelle ligne de plan', validate: 'Créer' }
      this.modifiedPlanLine = {
        name: '',
        descript: null,
        value: 0,
        total_value: null
      }
      this.showDlg = true
    },
    onEdit (item) {
      const sel = this.planLines.find(p => p.id === item.id)
      this.modifiedPlanLine = { ...sel }
      this.mentions = {
        title: 'Modifier la ligne de plan',
        validate: 'Modifier'
      }
      this.showDlg = true
    },
    onCancel () {
      this.showDlg = false
    },
    onSave (pl) {
      const action = this.mentions.validate === 'Créer'
        ? types.ADD_PLAN_LINE
        : types.UPDATE_PLAN_LINE
      this.$store.dispatch(action, { id: this.plan_id, planLine: pl })
    },
    onRemove (item) {
      this.deletedPlanLine = this.planLines.find(pl => pl.id === item.id)
      this.removeDlg = true
    },
    onConfirmRmv () {
      this.$store.dispatch(types.DEL_PLAN_LINE, {
        id: this.plan_id,
        planLine: this.deletedPlanLine
      })
      this.removeDlg = false
    },
    onCancelRmv () {
      this.removeDlg = false
    },
    onDownload () {
      let planLines = null
      const years = []
      const beneficiaries = []
      if (this.planLines.length > 0) {
        const keys = Object.keys(this.planLines[0])
        keys.forEach(p => {
          if (/20\d\d/.test(p)) {
            years.push(p)
          }
          if (/b\d+/.test(p)) {
            beneficiaries.push(p)
          }
        })
        planLines = this.planLines.map(pl => {
          const formattedPlanLine = {
            name: pl.name,
            value: pl.value * 0.01,
            total_value: pl.total_value * 0.01,
            commitment: pl.commitment * 0.01,
            programmings: pl.programmings * 0.01
          }
          for (const y of years) {
            formattedPlanLine['zz' + y] = pl[y] ? pl[y] * 0.01 : 0
          }
          for (const b of beneficiaries) {
            formattedPlanLine[b] = pl[b] ? Number(pl[b]) : 0
          }
          return formattedPlanLine
        })
      }
      const columns = [
        { header: 'Ligne de plan', key: 'name', width: 20 },
        {
          header: 'Montant total',
          key: 'total_value',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        },
        {
          header: 'Montant région',
          key: 'value',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        }
      ]
      for (const b of beneficiaries) {
        const beneficiaryId = Number(b.slice(1))
        const beneficiary = this.beneficiaryList.find(b => b.id === beneficiaryId)
        columns.push({
          header: beneficiary.name,
          key: b,
          width: 14,
          style: { numberFormat: '0.00%' }
        })
      }
      columns.push({
        header: 'Déjà engagé',
        key: 'commitment',
        width: 14,
        style: { numberFormat: '#,##0.00' },
        addTotal: true
      })
      columns.push({
        header: 'Programmé',
        key: 'programmings',
        width: 14,
        style: { numberFormat: '#,##0.00' },
        addTotal: true
      })
      for (const y of years) {
        columns.push({
          header: y,
          key: 'zz' + y,
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        })
      }
      excelExport(planLines, columns, 'Lignes de plan')
    },
    onDetailedDownload () {
      let planLines = null
      const years = []
      if (this.detailedPlanLines.length > 0) {
        const keys = Object.keys(this.detailedPlanLines[0])
        keys.forEach(p => {
          if (/20\d\d/.test(p)) years.push(p)
        })
        planLines = this.detailedPlanLines.map(pl => {
          const formattedPlanLine = {
            name: pl.name,
            value: pl.value * 0.01,
            total_value: pl.total_value * 0.01,
            op_name: pl.op_name,
            op_number: pl.op_number,
            category: pl.category,
            step: pl.step,
            commitment_code: pl.commitment_code,
            commitment_name: pl.commitment_name,
            commitment_date: pl.commitment_date
              ? new Date(pl.commitment_date)
              : null,
            commitment_value: pl.commitment_value
              ? pl.commitment_value * 0.01
              : null,
            programmings_date: pl.programmings_date
              ? new Date(pl.programmings_date)
              : null,
            programmings_value: pl.programmings_value
              ? pl.programmings_value * 0.01
              : null
          }
          for (const y of years) {
            formattedPlanLine['zz' + y] = pl[y] ? pl[y] * 0.01 : 0
          }
          return formattedPlanLine
        })
      }
      const columns = [
        { header: 'Ligne de plan', key: 'name', width: 20 },
        {
          header: 'Montant total',
          key: 'total_value',
          width: 16,
          style: { numberFormat: '#,##0.00', wrapText: true }
        },
        {
          header: 'Montant région',
          key: 'value',
          width: 14,
          style: { numberFormat: '#,##0.00', wrapText: true }
        },
        {
          header: 'Code de l\'opération',
          key: 'op_number',
          width: 10,
          style: { wrapText: true }
        },
        { header: 'Nom de l\'opération', key: 'op_name', width: 30 },
        { header: 'Catégorie', key: 'category', width: 15 },
        { header: 'Etape', key: 'step', width: 15 },
        {
          header: 'Date d\'engagement',
          key: 'commitment_date',
          width: 12,
          style: { numberFormat: 'dd/mm/yyyy', wrapText: true }
        },
        {
          header: 'Code IRIS',
          key: 'commitment_code',
          width: 10,
          style: { wrapText: true }
        },
        { header: 'Nom IRIS', key: 'commitment_name', width: 30 },
        {
          header: 'Montant de l\'engagement',
          key: 'commitment_value',
          width: 14,
          style: { numberFormat: '#,##0.00', wrapText: true },
          addTotal: true
        },
        {
          header: 'Date programmation',
          key: 'programmings_date',
          width: 12,
          style: { numberFormat: 'dd/mm/yyyy', wrapText: true }
        },
        {
          header: 'Montant programmé',
          key: 'programmings_value',
          width: 14,
          style: { numberFormat: '#,##0.00', wrapText: true },
          addTotal: true
        }
      ]
      for (const year of years) {
        columns.push({
          header: year,
          key: 'zz' + year,
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        })
      }
      excelExport(planLines, columns, 'Détail lignes de plan')
    }
  },
  created () {
    this.$store.dispatch(types.GET_PLAN_LINES, { id: this.plan_id })
    this.$store.dispatch(types.GET_DETAILED_PLAN_LINES, { id: this.plan_id })
  },
  watch: {
    $route () {
      this.$store.dispatch(types.GET_PLAN_LINES, { id: this.plan_id })
    },
    planLines (newList) {
      this.items = []
      this.total_valueTotal = 0
      this.valueTotal = 0
      this.commitmentTotal = 0
      this.programmingsTotal = 0
      this.prevTotal = 0
      if (newList.length > 0) {
        const keys = Object.keys(newList[0])
        const years = keys.filter(y => /20\d\d/.test(y))
        newList.forEach(pl => {
          let prev = 0
          const commitment = pl.commitment
          for (const y of years) {
            prev += pl[y] || 0
          }
          this.items.push({
            id: pl.id,
            name: pl.name,
            descript: pl.descript,
            value: pl.value,
            total_value: pl.total_value,
            commitment: commitment,
            programmings: pl.programmings,
            prev: prev
          })
          this.total_valueTotal += pl.total_value
          this.valueTotal += pl.value
          this.commitmentTotal += commitment
          this.programmingsTotal += pl.programmings
          this.prevTotal += prev
        })
      }
    }
  }
}
</script>
