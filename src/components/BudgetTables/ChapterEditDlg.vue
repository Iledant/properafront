<template>
  <v-dialog :value="value" @input="$emit('input', false)" max-width="600px" persistent>
    <v-card>
      <v-card-title class="secondary title">{{ mentions.title }}</v-card-title>
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              label="Code"
              v-model="BudgetChapter.code"
              required
              :rules="[checkIfNotEmpty]"
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field
              label="Intitulé"
              v-model="BudgetChapter.name"
              required
              :rules="[checkIfNotEmpty]"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn color="primary" text @click="$emit('input',false)">Annuler</v-btn>
        <v-btn color="primary" text @click="onSave" :disabled="disabled">{{ mentions.validate }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import checkIfNotEmpty from '../Mixins/CheckIfNotEmpty'
export default {
  name: 'ChapterEditDlg',
  mixins: [checkIfNotEmpty],
  props: {
    BudgetChapter: { type: Object, default: v => ({}) },
    mentions: Object,
    value: { type: Boolean, default: false }
  },
  computed: {
    disabled () {
      return this.BudgetChapter.name === '' || this.BudgetChapter.code === ''
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
