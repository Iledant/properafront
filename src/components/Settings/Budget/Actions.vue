<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            prepend-icon="search"
            label="Recherche"
            single-line
            hide-details
            v-model="search"
          />
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="actions"
            class="elevation-1"
            :loading="loading"
            dense
            :search="search"
            no-data-text="Aucune ligne à afficher"
            no-results-text="Recherche infructueuse"
          >
            <template #item="{item}">
              <tr>
                <td class="px-0">
                  <v-btn
                    icon
                    text
                    small
                    class="pa-0"
                    color="secondary"
                    @click="edit(item)"
                  >
                    <v-icon>edit</v-icon>
                  </v-btn>
                </td>
                <td class="px-0">
                  <v-btn
                    icon
                    text
                    small
                    class="pa-0"
                    color="error"
                    @click="remove(item)"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
                <td>{{ item.chapter }}</td>
                <td>{{ item.sector }}</td>
                <td>{{ item.program }}</td>
                <td class="text-right">{{ item.code }}</td>
                <td>{{ item.name }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn color="primary" text @click="add">Ajouter</v-btn>
    </v-card-actions>
    <action-edit-dlg
      :mentions="mentions"
      :BudgetAction="action"
      v-model="showActionDlg"
      @save="save"
    />
    <delete-dlg
      v-model="deleteDlg"
      cat="l'action"
      :name="deletedAction ? `${deletedAction.code} - ${deletedAction.name}` : ''"
      @confirm="confirmDelete"
    />
  </v-card>
</template>

<script>
import * as types from '@/store/mutation-types.js'
import ActionEditDlg from './ActionEditDlg.vue'
import DeleteDlg from '@/components/DeleteDlg.vue'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'Actions',
  components: { ActionEditDlg, DeleteDlg },
  data: () => ({
    mentions: { title: 'Nouveau chapitre', validate: 'Créer' },
    headers: [
      { text: '', value: '', sortable: false, width: '1%' },
      { text: '', value: '', sortable: false, width: '1%' },
      { text: 'Chapitre', value: 'chapter' },
      { text: 'Secteur', value: 'sector' },
      { text: 'Programme', value: 'program' },
      { text: 'Code action', value: 'code', align: 'right' },
      { text: 'Intitulé', value: 'name' }
    ],
    search: '',
    deletedAction: null,
    deleteDlg: false,
    action: null,
    showActionDlg: false
  }),
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      chapters: state => state.budgetTables.chapterList,
      sectors: state => state.budgetTables.sectorList,
      programs: state => state.budgetTables.programList,
      actions: state => state.budgetTables.actionList
    })
  },
  methods: {
    remove (item) {
      this.deletedAction = this.actions.find(c => c.id === item.id)
      this.deletedAction.chapter_id = item.chapter_id
      this.deleteDlg = true
    },
    confirmDelete () {
      this.$store.dispatch(types.DEL_BUDGET_ACTION, {
        BudgetAction: this.deletedAction
      })
    },
    add () {
      this.action = {
        id: 0,
        program_id: null,
        sector_id: null,
        chapter_id: null,
        name: '',
        code: ''
      }
      this.mentions = { title: 'Nouvelle action', validate: 'Créer' }
      this.showActionDlg = true
    },
    edit (item) {
      const a = this.actions.find(c => c.id === item.id)
      this.action = { ...a }
      this.mentions = { title: 'Modifier l\'action', validate: 'Modifier' }
      this.showActionDlg = true
    },
    save () {
      const action = this.mentions.validate === 'Créer'
        ? types.ADD_BUDGET_ACTION
        : types.UPDATE_BUDGET_ACTION
      this.$store.dispatch(action, { BudgetAction: this.action })
      this.showActionDlg = false
    }
  }
}
</script>
