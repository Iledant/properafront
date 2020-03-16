<template>
  <v-dialog
    :value="value"
    @input="$emit('input', false)"
    max-width="600px"
    v-if="scenario"
    persistent
  >
    <v-card class="mt-2" v-if="scenario">
      <v-card-title class="secondary title">{{ mentions.title }}</v-card-title>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field label="Nom" v-model="scenario.name" :rules="[checkIfNotEmpty]" required />
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Description" v-model="scenario.descript" />
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
import checkIfNotEmpty from '@/components/Mixins/CheckIfNotEmpty'
export default {
  mixins: [checkIfNotEmpty],
  name: 'ScenarioEditDlg',
  props: {
    scenario: Object,
    value: { type: Boolean, default: false },
    mentions: {
      title: { type: String, default: 'Nouveau scénario' },
      validate: { type: String, default: 'Créer' }
    }
  },
  computed: {
    disabled () {
      return this.scenario.name.length === 0
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
