<template>
  <v-dialog :value="value" max-width="600px" v-if="Step" persistent>
    <v-card class="elevation-1">
      <v-card-title class="secondary title">{{ mentions.title }}</v-card-title>
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              label="Nom"
              v-model="Step.name"
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
  name: 'StepDlg',
  mixins: [checkIfNotEmpty],
  props: {
    Step: { type: Object, default: v => ({ id: 0, name: '' }) },
    mentions: {
      title: { type: String, default: 'Modifier l\'étape' },
      validate: { type: String, default: 'Modifier' }
    },
    value: { type: Boolean, default: false }
  },
  data: () => ({ menu: false }),
  computed: {
    disabled () {
      return !this.Step.name
    }
  },
  methods: {
    onSave () {
      if (!this.Step.name) return
      this.$emit('save')
      this.$emit('input', false)
    }
  }
}
</script>
