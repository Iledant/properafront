<template>
  <v-dialog :value="value" max-width="600px" persistent>
    <v-card>
      <v-card-title class="secondary title">Message du jour</v-card-title>
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              label="Titre"
              v-model="TodayMessage.title"
              data-cy="todayMsgTitle"
            />
          </v-flex>
          <v-flex xs12>
            <v-textarea
              rows="10"
              label="Corps du message"
              v-model="TodayMessage.text"
              data-cy="todayMsgText"
            />
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn
          color="primary"
          text
          @click="$emit('input', false)"
          data-cy="todayMsgCancel">
          Annuler
        </v-btn>
        <v-btn color="primary" text @click="onSave" data-cy="todayMsgOk" >
          Modifier
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'TodayMessageDlg',
  props: {
    TodayMessage: { type: Object, default: v => ({ title: '', text: '' }) },
    value: { type: Boolean, default: false }
  },
  methods: {
    onSave () {
      this.$emit('save')
      this.$emit('input', false)
    }
  }
}
</script>
