<template>
  <v-card>
    <v-card-title class="secondary">Opérations physiques</v-card-title>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field prepend-icon="search" label="Recherche" v-model="search" />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :loading="loading"
            dense
            :headers="headers"
            :items="opList"
            :search="search"
            class="elevation-1"
            no-data-text="Aucune opération"
            no-results-text="Aucune opération trouvée"
          >
            <template #item="{ item }">
              <tr>
                <td class="px-0">
                  <v-tooltip right v-if="!isObserver">
                    <template #activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        @click.stop="onModify(item)"
                        class="pa-0"
                        v-on="on"
                      >
                        <v-icon color="secondary">edit</v-icon>
                      </v-btn>
                    </template>
                    <span>Modifier</span>
                  </v-tooltip>
                </td>
                <td class="px-0">
                  <v-tooltip right v-if="isAdmin">
                    <template #activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        @click="onDelete(item)"
                        class="pa-0"
                        v-on="on"
                      >
                        <v-icon color="error">delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Supprimer</span>
                  </v-tooltip>
                </td>
                <td>{{ item.number }}</td>
                <td>
                  <router-link
                    :to="{
                    name: 'OpDetails',
                    params: {
                      op_id: item.id,
                      op_name: item.name,
                      op_number: item.number
                    }
                  }"
                    class="table-link"
                  >{{ item.name }}</router-link>
                </td>
                <td class="text-right">{{ item.value | valueFilter }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-btn text color="primary" @click="onAdd" v-if="isAdmin">Ajouter</v-btn>
      <v-spacer />
      <v-btn text color="primary" @click="download">Export Excel</v-btn>
    </v-card-actions>
    <op-edit-dlg
      v-model="showDlg"
      :op="op"
      :mentions="mentions"
      @save="onSave($event)"
    />
    <delete-dlg
      v-model="removeDlg"
      cat="l'opération"
      :name="deletedOpName"
      @confirm="onConfirmRmv"
    />
  </v-card>
</template>

<script>
import * as types from '../store/mutation-types.js'
import OpEditDlg from './PhysicalOps/OpEditDlg.vue'
import DeleteDlg from './DeleteDlg.vue'
import isAdmin from './Mixins/isAdmin'
import isObserver from './Mixins/isObserver'
import { excelExport, dateStyle, valStyle, percentStyle } from './Utils/excelExport'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'PhysicalOps',
  mixins: [isAdmin, isObserver],
  components: { OpEditDlg, DeleteDlg },
  data: () => ({
    search: '',
    showDlg: false,
    removeDlg: false,
    op: null,
    deletedOp: null,
    mentions: { title: 'Nouvelle opération', validate: 'Créer' },
    headers: [
      { text: '', value: '', sortable: false, width: '1%' },
      { text: '', value: '', sortable: false, width: '1%' },
      { text: 'Numéro', value: 'number' },
      { text: 'Nom', value: 'name' },
      { text: 'Valeur', value: 'value', align: 'right' }
    ],
    items: []
  }),
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      actionList: state => state.budgetTables.actionList,
      opList: state => state.physops.ops,
      paymentTypesList: state => state.paymentRatios.paymentTypes
    }),
    deletedOpName () {
      return this.deletedOp
        ? (this.deletedOp.number + '-' + this.deletedOp.name)
        : ''
    }
  },
  methods: {
    onDelete (item) {
      this.deletedOp = { ...item }
      this.removeDlg = true
    },
    onConfirmRmv () {
      this.$store.dispatch(types.DEL_PHYSICAL_OP, { op: this.deletedOp })
      this.removeDlg = false
    },
    onAdd () {
      this.op = {
        id: 0,
        number: '',
        name: '',
        descript: null,
        length: null,
        value: null,
        valuedate: null,
        tri: null,
        van: null,
        isr: false,
        budget_action_id: null,
        payment_types_id: null,
        plan_id: null,
        plan_line_id: null,
        step_id: null,
        category_id: null
      }
      this.mentions = { title: 'Nouvelle opération', validate: 'Créer' }
      this.showDlg = true
    },
    onModify (item) {
      this.op = { ...item }
      this.mentions = { title: 'Modifier l\'opération', validate: 'Modifier' }
      this.showDlg = true
    },
    onSave () {
      const { valuedate, ...others } = this.op
      const date = valuedate ? new Date(valuedate) : null
      if (this.mentions.validate === 'Créer') {
        this.$store.commit(types.NEW_NEGATIVE_ID)
        this.op.id = this.$store.state.ids.negativeId
        this.$store.dispatch(types.ADD_PHYSICAL_OP,
          { op: { valuedate: valuedate, ...others } }
        )
      } else {
        this.$store.dispatch(types.UPDATE_PHYSICAL_OP,
          { op: { valuedate: date, ...others } })
      }
    },
    download () {
      const ops = this.opList.map(({ value, van, tri, ...other }) => ({
        ...other,
        value: value ? value * 0.01 : null,
        van: van ? van * 0.01 : null,
        tri: tri ? tri * 0.01 : null
      }))
      const columns = [
        { header: 'Numéro', key: 'number', width: 8 },
        { header: 'Intitulé', key: 'name', width: 30 },
        { header: 'Description', key: 'descript', width: 30 },
        { header: 'Etape', key: 'step_name', width: 10 },
        { header: 'Catégorie', key: 'category_name', width: 38 },
        {
          header: 'Longueur',
          key: 'length',
          width: 10,
          style: { numberFormat: '#,##0' }
        },
        { header: 'Evaluation', key: 'value', ...valStyle },
        { header: 'Date de valeur', key: 'valuedate', ...dateStyle },
        { header: 'VAN', key: 'van', ...valStyle },
        { header: 'TRI', key: 'tri', ...percentStyle },
        { header: 'Référence de chronique', key: 'payment_type_id', width: 10 },
        {
          header: 'Référence d\'action budgétaire',
          key: 'budget_action_id',
          width: 10
        },
        {
          header: 'Nom d\'action budgétaire',
          key: 'budget_action_name',
          width: 50
        },
        {
          header: 'Référence de ligne de plan',
          key: 'plan_line_id',
          width: 10
        },
        { header: 'Nom de ligne de plan', key: 'plan_line_name', width: 50 }
      ]
      excelExport(ops, columns, 'opérations')
    }
  },
  created () {
    this.$store.dispatch(types.GET_PHYSICAL_OPS)
  }
}
</script>
