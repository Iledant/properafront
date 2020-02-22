<template>
  <v-dialog :value="value" max-width="600px" persistent>
    <v-card class="elevation-1">
      <v-card-title class="secondary">{{ mentions.title }}</v-card-title>
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              label="Code"
              v-model="BudgetSector.code"
              class="pr-2"
              :rules="[checkIfNotEmpty]"
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field
              label="Intitulé"
              v-model="BudgetSector.name"
              :rules="[checkIfNotEmpty]"
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
import checkIfNotEmpty from '../Mixins/CheckIfNotEmpty'
export default {
  name: 'SectorEditDlg',
  mixins: [checkIfNotEmpty],
  props: {
    BudgetSector: {
      type: Object,
      default: v => ({ id: 0, name: '', code: '' })
    },
    mentions: {
      type: Object,
      default: v => ({ title: 'Nouveau secteur', validate: 'Créer' })
    },
    value: { type: Boolean, default: false }
  },
  computed: {
    disabled () {
      return !this.BudgetSector.name || !this.BudgetSector.code
    }
  },
  methods: {
    onSave () {
      if (!this.disabled) {
        this.$emit('save')
        this.$emit('input', false)
      }
    }
  }
}
</script>
