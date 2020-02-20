<template>
  <v-dialog :value="value" max-width="600px" v-if="event" @input="$emit('input',false)" persistent>
    <v-card>
      <v-card-title class="primary title white--text">{{ mentions.title }}</v-card-title>
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field label="Nom" v-model="event.name" :rules="[checkIfNotEmpty]" required />
          </v-flex>
          <v-flex xs12 sm6>
            <v-menu
              :close-on-content-click="false"
              v-model="menu"
              transition="scale-transition"
              offset-y
              :nudge-right="40"
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-on="on"
                  label="Date"
                  v-model="formattedDate"
                  prepend-icon="event"
                  readonly
                />
              </template>
              <v-date-picker
                v-model="event.date"
                no-title
                locale="fr-FR"
                @input="menu = false"
                color="primary"
              />
            </v-menu>
          </v-flex>
          <v-flex xs12 sm6>
            <v-switch label="Date certaine ?" v-model="event.iscertain" />
          </v-flex>
          <v-flex xs12>
            <v-textarea label="Description" v-model="event.descript" />
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
import { dateFilter } from '../../filters/filters.js'
import checkIfNotEmpty from '../Mixins/CheckIfNotEmpty'
export default {
  name: 'OpEventDlg',
  mixins: [checkIfNotEmpty],
  props: {
    value: { type: Boolean, default: false },
    event: Object,
    mentions: {
      title: { type: String, default: 'Nouvel événement' },
      validate: { type: String, default: 'Créer' }
    }
  },
  data: () => ({ menu: false }),
  computed: {
    formattedDate () {
      return dateFilter(this.event.date)
    },
    disabled () {
      return this.event.name.length === 0
    }
  },
  methods: {
    onSave () {
      this.$emit('save')
      this.$emit('input', false)
    }
  }
}
</script>
