<template>
  <v-dialog :value="value" max-width="650px" v-if="op" persistent>
    <v-card>
      <v-card-title class="secondary">{{ mentions.title }}</v-card-title>
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs12 sm4>
            <v-text-field
              label="Numéro"
              :readonly="!isAdmin"
              v-model="op.number"
              :rules="[checkIfNotEmpty, checkNumberFormat]"
              required
            />
          </v-flex>
          <v-flex xs12 sm8>
            <v-text-field
              label="Nom"
              :readonly="!isAdmin"
              v-model="op.name"
              :rules="[checkIfNotEmpty]"
            />
          </v-flex>
          <v-flex xs12>
            <v-textarea label="Description" v-model="op.descript" />
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field label="Valeur" v-model="val" v-currency reverse />
          </v-flex>
          <v-flex xs12 sm6>
            <v-menu
              :close-on-content-click="false"
              v-model="menu"
              transition="scale-transition"
              offset-y
              :nudge-right="40"
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-on="on"
                  label="Date de valeur"
                  v-model="formattedValueDate"
                  prepend-icon="event"
                  readonly
                />
              </template>
              <v-date-picker
                v-model="op.valuedate"
                no-title
                locale="fr-fr"
                @input="menu = false"
                color="primary"
              />
            </v-menu>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field label="Longueur" prefix="m" v-model="len" reverse v-int-input />
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field label="TRI" prefix="%" v-model="tri" reverse v-tri-input />
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field label="VAN" v-model="van" v-currency reverse />
          </v-flex>
          <v-flex xs12 sm6>
            <v-switch label="Opération ISR ?" v-model="op.isr" />
          </v-flex>
          <v-flex xs12 sm6>
            <v-autocomplete
              :items="actionItems"
              v-model="op.budget_action_id"
              label="Action budgétaire"
              item-text="name"
              item-value="id"
              :disabled="!isAdmin"
              no-data-text="Aucune action trouvée"
            />
          </v-flex>
          <v-flex xs12 sm6>
            <v-autocomplete
              :items="paymentTypesItem"
              v-model="op.payment_types_id"
              label="Chronique enregistrée"
              item-text="name"
              item-value="id"
              :disabled="!isAdmin"
              no-data-text="Aucune chronique trouvée"
            />
          </v-flex>
          <v-flex xs12 sm6>
            <v-autocomplete
              :items="plans"
              v-model="plan_id"
              label="Plan de rattachement"
              item-text="name"
              item-value="id"
              :disabled="!isAdmin"
              no-data-text="Aucun plan trouvé"
            />
          </v-flex>
          <v-flex xs12 sm6>
            <v-autocomplete
              :items="planLines"
              v-model="op.plan_line_id"
              label="Ligne de plan"
              no-data-text="Aucun ligne trouvée"
              item-text="name"
              item-value="id"
              :disabled="!isAdmin"
            />
          </v-flex>
          <v-flex xs12 sm6>
            <v-autocomplete
              :items="steps"
              v-model="op.step_id"
              label="Étape"
              item-text="name"
              item-value="id"
              :disabled="!isAdmin"
              no-data-text="Aucune étape trouvée"
            />
          </v-flex>
          <v-flex xs12 sm6>
            <v-autocomplete
              :items="categories"
              v-model="op.category_id"
              label="Catégorie"
              no-data-text="Aucune catégorie trouvée"
              item-text="name"
              item-value="id"
              :disabled="!isAdmin"
            />
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn color="primary" text @click="$emit('input', false)">Annuler</v-btn>
        <v-btn color="primary" text @click="onSave" :disabled="disabled">
          {{ mentions.validate }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { dateValueFilter, intFormat, triFormat } from '@/filters/filters'
import checkIfNotEmpty from '@/components/Mixins/CheckIfNotEmpty'
import * as types from '@/store/mutation-types'
import isAdmin from '@/components/Mixins/isAdmin'
import currencyInput from '@/components/Mixins/currencyInput'
import { mapState } from 'vuex'

export default {
  name: 'OpEditDlg',
  mixins: [checkIfNotEmpty, isAdmin, currencyInput],
  props: {
    value: { type: Boolean, default: false },
    op: { type: Object, default: v => ({}) },
    mentions: {
      title: { type: String, default: 'Nouvelle opération' },
      validate: { type: String, default: 'Créer' }
    }
  },
  data: () => ({
    menu: false,
    plan_id: null,
    val: '',
    van: '',
    len: '',
    tri: ''
  }),
  computed: {
    ...mapState({
      actionItems: state => [
        { id: null, name: '<aucune action>' },
        ...state.budgetTables.actionList.map(a =>
          ({ id: a.id, name: a.full_code + ' - ' + a.name }))
      ],
      plans: state => [
        { id: null, name: '<aucun ligne de plan>' },
        ...state.plans.plans
      ],
      paymentTypesItem: state => [
        { id: null, name: '<aucune chronique>' },
        ...state.paymentRatios.paymentTypes
      ],
      planLines: state => [
        { id: null, name: '<aucun ligne de plan>' },
        ...state.planLines.planLines
      ],
      steps: state => [
        { id: null, name: '<aucune étape>' },
        ...state.stepsAndCategories.steps
      ],
      categories: state => [
        { id: null, name: '<aucune catégorie>' },
        ...state.stepsAndCategories.categories
      ]
    }),
    formattedValueDate () {
      return dateValueFilter(this.op.valuedate)
    },
    disabled () {
      return !this.op.name || !this.testNumberFormat(this.op.number)
    }
  },
  methods: {
    testNumberFormat (input) {
      return /^\d{2}[A-Z]{2}\d{3}$/.test(input)
    },
    checkNumberFormat (n) {
      return this.testNumberFormat(n) || 'Format incorrect (exemple 01TC002)'
    },
    onSave () {
      if (!this.disabled) {
        this.op.plan_id = this.plan_id
        this.op.value = this.parseCurrency(this.val)
        this.op.van = this.parseCurrency(this.van)
        this.op.length = this.len !== ''
          ? parseInt(this.len.replace(/\s/g, ''))
          : null
        this.op.tri = this.tri !== ''
          ? Math.round(100 * parseFloat(this.tri.replace(/,/g, '.')))
          : null
        this.$emit('save')
        this.$emit('input', false)
      }
    }
  },
  watch: {
    op (newOp) {
      this.plan_id = newOp ? newOp.plan_id : null
      this.val = this.formatCurrency(this.op.value)
      this.van = this.formatCurrency(this.op.van)
      this.len = intFormat(this.op.length)
      this.tri = triFormat(this.op.tri)
    },
    actionList (list) {
      this.actionItems = [{ id: null, name: '<aucune action>' }]
      list.forEach(a =>
        this.actionItems.push({ id: a.id, name: a.full_code + ' - ' + a.name })
      )
    },
    plan_id (newPlanId) {
      if (newPlanId) {
        this.$store.dispatch(types.GET_PLAN_LINES, { id: newPlanId })
      }
    }
  },
  created () {
    this.$store.dispatch(types.GET_PLANS)
  }
}
</script>
