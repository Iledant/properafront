<template>
  <v-dialog :value="value" max-width="600px" persistent>
    <v-card>
      <v-card-title class="secondary title">Modifier le nom du bénéficiaire</v-card-title>
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field label="Code" v-model="beneficiary.code" disabled />
          </v-flex>
          <v-flex xs12>
            <v-text-field
              label="Nom"
              v-model="beneficiary.name"
              :rules="[checkIfNotEmpty]"
            />
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn color="primary" text @click="$emit('input', false)">Annuler</v-btn>
        <v-btn color="primary" text @click="onSave" :disabled="disabled">Modifier</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import checkIfNotEmpty from '@/components/Mixins/CheckIfNotEmpty'
export default {
  name: 'BeneficiaryEditDlg',
  mixins: [checkIfNotEmpty],
  props: {
    beneficiary: { type: Object, default: b => ({}) },
    value: { type: Boolean, default: false }
  },
  computed: {
    disabled () {
      return !this.beneficiary.name
    }
  },
  methods: {
    onSave () {
      if (!this.disabled) {
        this.$emit('input', false)
        this.$emit('save')
      }
    }
  }
}
</script>
