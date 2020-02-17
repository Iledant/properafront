<template>
  <v-dialog
    :value="value"
    max-width="600px"
    @input="$emit('input', false)"
    v-if="planline"
    persistent
  >
    <v-card>
      <v-card-title class="secondary title">{{ mentions.title }}</v-card-title>
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field label="Nom" v-model="name" :rules="[checkIfNotEmpty]" required />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="Montant Région"
              v-model="val"
              :rules="[checkIfNotEmpty]"
              required
              v-currency
              reverse
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field label="Montant total" v-model="totVal" v-currency reverse />
          </v-flex>
          <v-flex xs12>
            <v-textarea label="Description" v-model="desc" />
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
export default {
  mixins: [checkIfNotEmpty, currencyInput],
  name: 'PlanLineEditDlg',
  props: {
    value: { type: Boolean, default: false },
    planline: Object,
    dialog: { type: Boolean, default: false },
    mentions: {
      title: { type: String, default: 'Nouvelle ligne de plan' },
      validate: { type: String, default: 'Créer' }
    }
  },
  data () {
    return {
      name: '',
      totVal: '',
      val: '',
      desc: ''
    }
  },
  computed: {
    disabled () {
      return this.name === '' || this.planline.val === ''
    }
  },
  methods: {
    onSave () {
      if (!this.disabled) {
        this.$emit('save', {
          id: this.planline.id,
          name: this.name,
          descript: this.descript,
          value: this.parseCurrency(this.val),
          total_value: this.parseCurrency(this.totVal)
        })
        this.$emit('input', false)
      }
    }
  },
  watch: {
    value () {
      this.name = this.planline.name
      this.desc = this.planline.descript
      this.val = this.formatCurrency(this.planline.value)
      this.totVal = this.formatCurrency(this.planline.total_value)
    }
  }
}
</script>
