<template>
  <v-dialog :value="value" max-width="600px" persistent>
    <v-card>
      <v-card-title class="secondary">{{ mentions.title }}</v-card-title>
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              label="Nom"
              v-model="Category.name"
              required :rules="[checkIfNotEmpty]"
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
  name: 'CategoryDlg',
  mixins: [checkIfNotEmpty],
  props: {
    Category: { type: Object, default: v => ({ name: '' }) },
    mentions: {
      title: { type: String, default: 'Modifier la catégorie' },
      validate: { type: String, default: 'Modifier' }
    },
    value: { type: Boolean, default: false }
  },
  data: () => ({ menu: false }),
  computed: {
    disabled () {
      return !this.Category.name
    }
  },
  methods: {
    onSave () {
      if (this.disabled) return
      this.$emit('save')
      this.$emit('input', false)
    }
  }
}
</script>
