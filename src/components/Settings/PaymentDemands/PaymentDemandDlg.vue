<template>
  <v-dialog :value="value" max-width="600px" persistent>
    <v-card>
      <v-card-title class="secondary">
        Modifier l'exclusion de la demande de paiement
      </v-card-title>
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <strong>Bénéficiaire </strong>{{ paymentDemand.beneficiary }}<br />
            <strong>Demande du </strong>{{ paymentDemand.demand_date | dateFilter }}<br />
            <strong>Montant </strong>{{ paymentDemand.demand_value | valueFilter }}<br />
          </v-flex>
          <v-flex xs12>
            <v-checkbox label="Exclus ?" v-model="paymentDemand.excluded" />
          </v-flex>
          <v-flex xs12>
            <v-textarea
              label="Commentaire pour l'exclusion"
              v-model="paymentDemand.excluded_comment"
            />
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn color="primary" text @click="$emit('input', false)">Annuler</v-btn>
        <v-btn color="primary" text @click="onSave">
          Modifier
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'PaymentDemandDlg',
  props: {
    paymentDemand: { type: Object, default: b => ({ excluded: false, excluded_comment: null }) },
    value: { type: Boolean, default: false }
  },
  methods: {
    onSave () {
      const normalized = { ...this.paymentDemand }
      normalized.excluded_comment = this.paymentDemand.excluded_comment || null
      this.$emit('input', false)
      this.$emit('save', normalized)
    }
  }
}
</script>
