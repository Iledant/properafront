<template>
  <v-dialog
    :value="value"
    @input="$emit('input', false)"
    max-width="600px"
    v-if="budgetCredit"
    persistent
  >
    <v-card>
      <v-card-title class="secondary title">{{ mentions.title }}</v-card-title>
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs6 class="pr-2">
            <v-menu
              ref="menu"
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
                  label="Date"
                  v-model="budgetCredit.commission_date"
                  prepend-icon="event"
                  readonly
                />
              </template>
              <v-date-picker
                v-model="budgetCredit.commission_date"
                @input="menu = false"
                color="primary"
                no-title
              />
            </v-menu>
          </v-flex>
          <v-flex xs6>
            <v-select
              :items="chapList"
              v-model="budgetCredit.chapter"
              label="Chapitre"
              single-line
              item-text="code"
              item-value="code"
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="Budget initial"
              v-model="primary_commitment"
              :rules="[checkIfNotEmpty]"
              required
              v-currency
              reverse
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field label="Gel" v-model="frozen_commitment" v-currency reverse />
          </v-flex>
          <v-flex xs6>
            <v-text-field label="Mise en réserve" v-model="reserved_commitment" v-currency reverse />
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn color="primary" text @click="$emit('input', false)">Annuler</v-btn>
        <v-btn color="primary" text @click="onSave" :disabled="disabled">{{ mentions.validate }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import checkIfNotEmpty from '../Mixins/CheckIfNotEmpty'
import currencyInput from '../Mixins/currencyInput'
import { dateFilter } from '../../filters/filters'

export default {
  mixins: [checkIfNotEmpty, currencyInput],
  name: 'BudgetCreditsDlg',
  props: {
    budgetCredit: Object,
    value: { type: Boolean, default: false },
    mentions: {
      title: { type: String, default: 'Nouveau montant de budget' },
      validate: { type: String, default: 'Créer' }
    }
  },
  data: () => ({
    menu: false,
    primary_commitment: '',
    frozen_commitment: '',
    reserved_commitment: ''
  }),
  computed: {
    disabled () {
      return this.primary_commitment === '' ||
        !this.budgetCredit.commission_date ||
        !this.budgetCredit.chapter
    },
    formattedDate () {
      return dateFilter(this.budgetCredit.date)
    },
    chapList () {
      return this.$store.state.budgetTables.chapterList
    }
  },
  methods: {
    onSave () {
      if (!this.disabled) {
        this.budgetCredit.primary_commitment =
          this.parseCurrency(this.primary_commitment)
        this.budgetCredit.frozen_commitment =
          this.parseCurrency(this.frozen_commitment)
        this.budgetCredit.reserved_commitment =
          this.parseCurrency(this.reserved_commitment)
        this.$emit('save')
        this.$emit('input', false)
      }
    }
  },
  watch: {
    budgetCredit (b) {
      this.primary_commitment = this.formatCurrency(b.primary_commitment)
      this.frozen_commitment = this.formatCurrency(b.frozen_commitment)
      this.reserved_commitment = this.formatCurrency(b.reserved_commitment)
    }
  }
}
</script>
