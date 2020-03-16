<template>
  <v-card>
    <v-card-title class="secondary">
      AP votées, gelées, mises en réserve
    </v-card-title>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            label="Recherche"
            single-line
            hide-details
            v-model="search"
            prepend-icon="search"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :loading="loading"
            :headers="headers"
            :items="credits"
            :search="search"
            dense
            class="elevation-1"
            no-data-text="Aucun crédit trouvé"
            no-results-text="Recherche infructueuse"
          >
            <template #item="{ item }">
              <tr class="table-link primary--text" @click="modify(item)">
                <td>{{ item.commission_date | dateFilter }}</td>
                <td>{{ item.chapter }}</td>
                <td class="text-right">
                  {{ item.primary_commitment | valueFilter }}
                </td>
                <td class="text-right">
                  {{ item.frozen_commitment | valueFilter }}
                </td>
                <td class="text-right">
                  {{ item.reserved_commitment | valueFilter }}
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn text color="primary" @click="add">Ajouter</v-btn>
    </v-card-actions>
    <BudgetCreditsDlg
      :budgetCredit="modifiedBudgetCredit"
      v-model="bcDlg"
      :mentions="mentions"
      @save="onSave"
    />
  </v-card>
</template>

<script>
import * as types from '@/store/mutation-types.js'
import BudgetCreditsDlg from './BudgetCredits/BudgetCreditsDlg.vue'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'BudgetCredits',
  components: { BudgetCreditsDlg },
  data: () => ({
    search: '',
    headers: [
      { text: 'Date commission', value: 'commission_date' },
      { text: 'Chapitre', value: 'chapter' },
      { text: 'Budget initial', value: 'primary_commitment', align: 'right' },
      { text: 'Gel', value: 'frozen_commitment', align: 'right' },
      { text: 'Mise en réserve', value: 'reserved_commitment', align: 'right' }
    ],
    modifiedBudgetCredit: null,
    bcDlg: false,
    mentions: { title: 'Modifier la ligne de crédit', validate: 'Modifier' }
  }),
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      credits: state => state.budgetTables.creditsList
    })
  },
  methods: {
    modify (item) {
      this.modifiedBudgetCredit = {
        id: item.id,
        chapter: item.chapter,
        commission_date: item.commission_date,
        primary_commitment: item.primary_commitment,
        frozen_commitment: -item.frozen_commitment,
        reserved_commitment: -item.reserved_commitment
      }
      this.mention = {
        title: 'Modifier la ligne de crédit',
        validate: 'Modifier'
      }
      this.bcDlg = true
    },
    add () {
      this.$store.commit(types.NEW_NEGATIVE_ID)
      this.modifiedBudgetCredit = {
        id: this.$store.state.ids.negativeId,
        chapter: null,
        commission_date: null,
        primary_commitment: 0,
        frozen_commitment: 0,
        reserved_commitment: 0
      }
      this.mentions = { title: 'Nouvelle ligne de crédit', validate: 'Créer' }
      this.bcDlg = true
    },
    onSave () {
      const dispatchName =
        this.mentions === 'Modifier'
          ? types.UPDATE_BUDGET_CREDIT
          : types.ADD_BUDGET_CREDIT
      this.$store.dispatch(dispatchName, {
        id: this.modifiedBudgetCredit.id,
        chapter: parseInt(this.modifiedBudgetCredit.chapter),
        commission_date: new Date(this.modifiedBudgetCredit.commission_date),
        primary_commitment: this.modifiedBudgetCredit.primary_commitment,
        frozen_commitment: -this.modifiedBudgetCredit.frozen_commitment,
        reserved_commitment: -this.modifiedBudgetCredit.reserved_commitment
      })
    }
  },
  created () {
    this.$store.dispatch(types.GET_ALL_BUDGET_CREDITS)
  }
}
</script>
