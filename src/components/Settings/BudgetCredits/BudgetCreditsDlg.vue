<template>
  <v-dialog :value="value" max-width="600px" v-if="budgetCredit" persistent>
    <v-card>
      <v-card-title class="secondary">{{ mentions.title }}</v-card-title>
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs6>
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
              <template #activator="{ on }">
                <v-text-field
                  v-on="on"
                  label="Date"
                  v-model="budgetCredit.commission_date"
                  prepend-icon="event"
                  readonly
                  :rules="[c => c || 'Date obligatoire']"
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
              :items="chapters"
              v-model="budgetCredit.chapter"
              label="Chapitre"
              single-line
              item-text="code"
              item-value="code"
              :rules="[c => c || 'Chapitre obligatoire']"
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="Budget initial"
              v-model="primary"
              :rules="[checkIfNotEmpty]"
              v-currency
              reverse
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field label="Gel" v-model="frozen" v-currency reverse />
          </v-flex>
          <v-flex xs6>
            <v-text-field label="Mise en réserve" v-model="reserved" v-currency reverse />
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
import checkIfNotEmpty from '@/components/Mixins/CheckIfNotEmpty'
import currencyInput from '@/components/Mixins/currencyInput'
import { dateFilter } from '@/filters/filters'
import { mapState } from 'vuex'

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
    primary: '',
    frozen: '',
    reserved: ''
  }),
  computed: {
    ...mapState({
      chapters: state => state.budgetTables.chapterList
    }),
    disabled () {
      return !this.primary ||
        !this.budgetCredit.commission_date ||
        !this.budgetCredit.chapter
    },
    formattedDate () {
      return dateFilter(this.budgetCredit.date)
    }
  },
  methods: {
    onSave () {
      if (!this.disabled) return
      this.budgetCredit.primary_commitment = this.parseCurrency(this.primary)
      this.budgetCredit.frozen_commitment = this.parseCurrency(this.frozen)
      this.budgetCredit.reserved_commitment = this.parseCurrency(this.reserved)
      this.$emit('save')
      this.$emit('input', false)
    }
  },
  watch: {
    budgetCredit (b) {
      this.primary = this.formatCurrency(b.primary_commitment)
      this.frozen = this.formatCurrency(b.frozen_commitment)
      this.reserved = this.formatCurrency(b.reserved_commitment)
    }
  }
}
</script>
