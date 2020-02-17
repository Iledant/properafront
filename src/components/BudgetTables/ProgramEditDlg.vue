<template>
  <v-dialog :value="value" @input="$emit('input', false)" max-width="600px" persistent>
    <v-card class="elevation-1">
      <v-card-title class="secondary title">{{ mentions.title }}</v-card-title>
      <v-container grid-list-md>
        <v-layout row wrap align-baseline>
          <v-flex xs12>
            <v-autocomplete
              :items="items"
              v-model="BudgetProgram.chapter_id"
              label="Chapitre"
              item-text="code"
              item-value="id"
              no-data-text="Aucun programme trouvé"
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Code" v-model="code" required :rules="[checkCode]" />
          </v-flex>
          <v-flex xs1 class="subtitle-1">
            {{
            code.length > 2 ? this.code.substr(1, 2) : ''
            }}
          </v-flex>
          <v-flex xs11>
            <v-text-field
              label="Sous-fonction"
              v-model="BudgetProgram.code_subfunction"
              :rules="[checkSubfunction]"
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field
              label="Intitulé"
              v-model="BudgetProgram.name"
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
  name: 'ProgramEditDlg',
  mixins: [checkIfNotEmpty],
  props: {
    BudgetProgram: {
      type: Object,
      default: v => ({
        id: 0,
        name: '',
        code_contract: '',
        code_function: '',
        code_number: '',
        chapter_id: null,
        subfunction: ''
      })
    },
    mentions: Object,
    value: { type: Boolean, default: false }
  },
  computed: {
    disabled () {
      return (
        this.BudgetProgram.name === '' ||
        this.code.length !== 6 ||
        (this.BudgetProgram.code_subfunction &&
          this.BudgetProgram.code_subfunction.length !== 1) ||
        this.BudgetProgram.chapter_id === null
      )
    },
    chapters () {
      return this.$store.state.budgetTables.chapterList
    },
    items () {
      return this.chapters.map(c => ({
        id: c.id,
        code: `${c.code} - ${c.name}`
      }))
    }
  },
  data: () => ({ code: '' }),
  methods: {
    checkCode (input) {
      return input.length === 6
        ? true
        : 'Le code programme doit comporter 6 chiffres'
    },
    checkSubfunction (input) {
      return !input || input.length === 1
        ? true
        : 'Au plus un chiffre pour la sous-fonction'
    },
    onSave () {
      if (!this.disabled) {
        this.BudgetProgram.code_contract = this.code.substr(0, 1)
        this.BudgetProgram.code_function = this.code.substr(1, 2)
        this.BudgetProgram.code_number = this.code.substr(3, 3)
        this.$emit('save')
        this.$emit('input', false)
      }
    }
  },
  watch: {
    BudgetProgram (bp) {
      this.code = bp ? bp.code_contract + bp.code_function + bp.code_number : ''
    }
  }
}
</script>
