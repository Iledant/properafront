<template>
  <v-dialog :value="value" max-width="600px" persistent>
    <v-card>
      <v-card-title class="secondary title">{{ mentions.title }}</v-card-title>
      <v-card-text>
        <v-container grid-list-md fluid>
          <v-layout row wrap>
            <v-flex xs12>
              <v-menu
                :close-on-content-click="false"
                v-model="menu"
                transition="scale-transition"
                offset-y
                :nudge-right="40"
                max-width="290px"
                min-width="290px"
              >
                <template #activator="{ on }">
                  <v-text-field
                    v-on="on"
                    label="Date"
                    v-model="formattedDate"
                    prepend-icon="event"
                    readonly
                    :rules="[d => d || 'Date obligatoire']"
                  />
                </template>
                <v-date-picker
                  v-model="Commission.date"
                  no-title
                  color="primary"
                  @input="menu = false"
                />
              </v-menu>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                label="Nom"
                v-model="Commission.name"
                required
                :rules="[checkIfNotEmpty]"
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
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
import checkIfNotEmpty from '@/components/Mixins/CheckIfNotEmpty'
import { dateFilter } from '@/filters/filters'
export default {
  name: 'CommissionDlg',
  mixins: [checkIfNotEmpty],
  props: {
    Commission: {
      type: Object,
      default: v => ({ id: 0, name: '', date: null })
    },
    value: { type: Boolean, default: false },
    mentions: {
      title: { type: String, default: 'Modifier la commission' },
      validate: { type: String, default: 'Modifier' }
    }
  },
  data: () => ({ menu: false }),
  computed: {
    disabled () {
      return !this.Commission.name || !this.Commission.date
    },
    formattedDate () {
      return dateFilter(this.Commission.date)
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
