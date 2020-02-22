<template>
  <v-dialog :value="value" max-width="600px" persistent>
    <v-card>
      <v-card-title class="secondary">{{ title }}</v-card-title>
      <v-card-text>
        <v-container grid-list-md fluid>
          <v-layout row wrap>
            <v-flex xs12>
              <v-autocomplete
                :items="beneficiaries"
                v-model="PaymentNeed.BeneficiaryID"
                label="Bénéficiaire"
                item-value="id"
                item-text="name"
                no-data-text="Liste des bénéficiaires vide"
              />
            </v-flex>
            <v-flex xs12>
              <v-menu
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
                    v-model="formattedDate"
                    prepend-icon="event"
                    readonly
                  />
                </template>
                <v-date-picker
                  v-model="pnDate"
                  no-title
                  color="primary"
                  @input="menu = false"
                />
              </v-menu>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                label="Montant"
                v-model="pnValue"
                :rules="[checkIfNotEmpty]"
                required
                v-currency
                reverse
              />
            </v-flex>
            <v-flex xs12>
              <v-textarea
                rows="4"
                label="Commentaire"
                v-model="PaymentNeed.Comment"
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn color="primary" text @click="$emit('input', false)">Annuler</v-btn>
        <v-btn color="primary" text @click="onSave" :disabled="disabled">
          {{ button }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import checkIfNotEmpty from '../Mixins/CheckIfNotEmpty'
import currencyInput from '../Mixins/currencyInput'
import { dateFilter } from '../../filters/filters'
export default {
  name: 'PaymentNeedDlg',
  mixins: [checkIfNotEmpty, currencyInput],
  props: {
    PaymentNeed: Object,
    value: { type: Boolean, default: false },
    action: {
      type: String,
      default: 'create',
      validator: v => ['create', 'modify'].indexOf(v) !== -1
    }
  },
  data: () => ({
    menu: false,
    pnValue: '',
    pnDate: ''
  }),
  computed: {
    title () {
      return this.action === 'create'
        ? 'Ajouter une nouvelle prévision'
        : 'Modifier la prévision'
    },
    button () {
      return this.action === 'create' ? 'Créer' : 'Modifier'
    },
    disabled () {
      return !this.pnValue || !this.pnDate || !this.PaymentNeed.BeneficiaryID
    },
    formattedDate () {
      return dateFilter(this.pnDate)
    },
    beneficiaries () {
      return this.$store.state.beneficiaries.beneficiaries
    }
  },
  methods: {
    onSave () {
      if (!this.disabled) {
        this.PaymentNeed.Value = this.parseCurrency(this.pnValue)
        const name = this.beneficiaries.find(b => b.ID === this.PaymentNeed.BeneficiaryID)
        this.PaymentNeed.BeneficiaryName = name
        this.PaymentNeed.Date = new Date(this.pnDate)
        this.$emit('save')
        this.$emit('input', false)
      }
    }
  },
  watch: {
    PaymentNeed (p) {
      this.pnValue = this.formatCurrency(this.PaymentNeed.Value)
      this.pnDate = p.Date ? new Date(this.PaymentNeed.Date).toISOString()
        .substr(0, 10) : ''
    }
  }
}
</script>
