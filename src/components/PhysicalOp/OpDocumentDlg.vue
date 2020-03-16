<template>
  <v-dialog
    :value="value"
    max-width="600px"
    v-if="document"
    persistent
  >
    <v-card>
      <v-card-title class="secondary">{{ mentions.title }}</v-card-title>
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              label="Description"
              v-model="document.name"
              :rules="[checkIfNotEmpty]"
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field
              label="Lien vers le document"
              v-model="document.link"
              :rules="[checkIfNotEmpty]"
            />
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn color="primary" text @click="$emit('input',false)">Annuler</v-btn>
        <v-btn color="primary" text @click="onSave" :disabled="disabled">
          {{ mentions.validate }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import checkIfNotEmpty from '@/components/Mixins/CheckIfNotEmpty'
export default {
  name: 'OpDocumentDlg',
  mixins: [checkIfNotEmpty],
  props: {
    document: { type: Object, default: v => ({ name: '', link: '' }) },
    value: { type: Boolean, default: false },
    mentions: {
      title: { type: String, default: 'Nouveau document' },
      validate: { type: String, default: 'Créer' }
    }
  },
  computed: {
    disabled () {
      return !this.document.name.length || !this.document.link.length
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
