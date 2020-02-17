<template>
  <v-dialog :value="value" @input="$emit('input', false)" max-width="600px">
    <v-card>
      <v-card-title class="error white--text title">Supprimer {{ cat }} ?</v-card-title>
      <v-container grid-list-md>Supprimer définitivement {{ cat }} : « {{ name }} » ?</v-container>
      <v-card-actions class="red lighten-5">
        <v-spacer />
        <v-btn color="primary" text @click="$emit('input', false)">Annuler</v-btn>
        <v-btn color="error" text @click="confirm">Supprimer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DeleteDlg',
  props: {
    value: { type: Boolean, default: false },
    cat: { type: String, default: '' },
    name: { type: String, default: '' }
  },
  methods: {
    confirm () {
      this.$emit('confirm')
      this.$emit('input', false)
    }
  }
}
</script>
