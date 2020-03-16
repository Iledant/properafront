<template>
  <v-dialog :value="value" max-width="600px" persistent>
    <v-card>
      <v-card-title class="secondary">{{ mentions.title }}</v-card-title>
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field label="Nom" v-model="plan.name" :rules="[checkIfNotEmpty]" />
          </v-flex>
          <v-flex xs12>
            <v-textarea label="Description" v-model="plan.descript" />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="Première année"
              v-model="plan.first_year"
              :rules="[nullYearRule]"
              prepend-icon="calendar_today"
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="Dernière année"
              v-model="plan.last_year"
              :rules="[nullYearRule, isLastGreater]"
              prepend-icon="calendar_today"
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
import checkIfNotEmpty from '@/components/Mixins/CheckIfNotEmpty'
const yearTest = y => /^20\d{2}$/.test(y)
export default {
  name: 'PlanEditDlg',
  mixins: [checkIfNotEmpty],
  props: {
    plan: {
      type: Object,
      default: v => ({
        name: '',
        first_year: null,
        last_year: null,
        descript: null
      })
    },
    mentions: Object,
    value: { type: Boolean, default: false }
  },
  computed: {
    disabled () {
      return (
        !this.plan.name.length ||
        !(!this.plan.first_year || yearTest(this.plan.first_year)) ||
        !(!this.plan.last_year || yearTest(this.plan.last_year)) ||
        (this.plan.last_year && this.plan.last_year < this.plan.first_year)
      )
    }
  },
  methods: {
    onSave () {
      if (this.disabled) return
      this.plan.descript = this.plan.descript === '' ? null : this.plan.descript
      this.plan.first_year = parseInt(this.plan.first_year) || null
      this.plan.last_year = parseInt(this.plan.last_year) || null
      this.$emit('save')
      this.$emit('input', false)
    },
    nullYearRule (y) {
      return !y || yearTest(y) || 'Année attendue'
    },
    isLastGreater () {
      return this.plan.last_year &&
      (this.plan.last_year >= this.plan.first_year ||
        'Doit être plus grande que la première')
    }
  }
}
</script>
