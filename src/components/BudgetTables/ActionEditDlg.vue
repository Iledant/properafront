<template>
  <v-dialog
    :value="value"
    max-width="600px"
    v-if="BudgetAction"
    @input="$emit('input', false)"
    persistent
  >
    <v-card class="elevation-1">
      <v-card-title class="secondary title">{{ mentions.title }}</v-card-title>
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <v-autocomplete
              :items="programItems"
              v-model="BudgetAction.program_id"
              label="Programme"
              item-text="code"
              item-value="id"
              no-data-text="Aucune action trouvée"
            />
          </v-flex>
          <v-flex xs12>
            <v-autocomplete
              :items="sectors"
              v-model="BudgetAction.sector_id"
              label="Secteur"
              item-text="code"
              item-value="id"
              no-data-text="Aucun secteur trouvé"
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field
              label="Code"
              v-model="BudgetAction.code"
              :prefix="programPrefix"
              required
              :rules="[checkCode]"
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field
              label="Intitulé"
              v-model="BudgetAction.name"
              required
              :rules="[checkIfNotEmpty]"
            />
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn color="primary" text @click="$emit('input', false)">Annuler</v-btn>
        <v-btn color="primary" text @click="onSave" :disabled="disabled">
          {{
          mentions.validate
          }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import checkIfNotEmpty from '../Mixins/CheckIfNotEmpty'
export default {
  name: 'ActionEditDlg',
  mixins: [checkIfNotEmpty],
  props: {
    BudgetAction: Object,
    mentions: Object,
    value: { type: Boolean, default: false }
  },
  computed: {
    disabled () {
      return (
        this.BudgetAction.name.length === 0 ||
        this.BudgetAction.code.length < 2 ||
        this.BudgetAction.code.length > 4 ||
        this.BudgetAction.program_id === null ||
        this.BudgetAction.sector_id === null
      )
    },
    programs () {
      return this.$store.state.budgetTables.programList
    },
    programPrefix () {
      const prg = this.programs.find(p => p.id === this.program_id)
      return prg ? prg.code_contract + prg.code_function + prg.code_number : ''
    },
    programItems () {
      return this.programs.map(p => ({
        id: p.id,
        code: `${p.code_contract}${p.code_function}${p.code_number} - ${p.name}`
      }))
    },
    sectors () {
      return this.$store.state.budgetTables.sectorList.map(s =>
        ({ id: s.id, code: `${s.code} - ${s.name}` }))
    }
  },
  methods: {
    checkCode (input) {
      return (input.length > 1 && input.length < 5) ||
        'Le code action doit comporter 2 à 4 caractères'
    },
    onSave () {
      if (!this.disabled) {
        const program = this.programs.find(
          p => p.id === this.BudgetAction.program_id
        )
        this.BudgetAction.chapter_id = program.chapter_id
        this.$emit('save')
        this.$emit('input', false)
      }
    }
  }
}
</script>
