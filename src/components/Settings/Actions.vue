<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            append-icon="search"
            label="Recherche"
            single-line
            hide-details
            v-model="search"
          />
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="actionItems"
            class="elevation-1"
            :loading="loading"
            dense
            :search="search"
            no-data-text="Aucune ligne à afficher"
            no-results-text="Recherche infructueuse"
          >
            <template v-slot:item="{item}">
              <tr>
                <td class="px-0">
                  <v-btn icon text small class="pa-0" color="secondary" @click="edit(item)">
                    <v-icon>edit</v-icon>
                  </v-btn>
                </td>
                <td class="px-0">
                  <v-btn icon text small class="pa-0" color="error" @click="remove(item)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
                <td class="text-left">{{ item.chapter }}</td>
                <td class="text-left">{{ item.sector }}</td>
                <td class="text-center">{{ item.program }}</td>
                <td class="text-center">{{ item.code }}</td>
                <td class="text-left">{{ item.name }}</td>
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
import * as types from '../../store/mutation-types.js'
import ActionEditDlg from '../BudgetTables/ActionEditDlg.vue'
import DeleteDlg from '../DeleteDlg.vue'
export default {
  name: 'Actions',
  components: { ActionEditDlg, DeleteDlg },
  data: () => ({
    mentions: { title: 'Nouveau chapitre', validate: 'Créer' },
    headers: [
      { text: '', value: '', sortable: false, width: '1%' },
      { text: '', value: '', sortable: false, width: '1%' },
      { text: 'Chapitre', value: 'chapter', align: 'center' },
      { text: 'Secteur', value: 'sector', align: 'center' },
      { text: 'Programme', value: 'program', align: 'center' },
      { text: 'Code action', value: 'code', align: 'center' },
      { text: 'Intitulé', value: 'name', align: 'center' }
    ],
    search: '',
    deletedAction: null,
    deleteDlg: false,
    action: null,
    showActionDlg: false
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    chapters () {
      return this.$store.state.budgetTables.chapterList
    },
    sectors () {
      return this.$store.state.budgetTables.sectorList
    },
    programs () {
      return this.$store.state.budgetTables.programList
    },
    actions () {
      return this.$store.state.budgetTables.actionList
    },
    actionItems () {
      const pList = this.programs
      const cList = this.chapters
      const sList = this.sectors
      if (
        !pList ||
        pList.length === 0 ||
        !cList ||
        cList.length === 0 ||
        !sList ||
        sList.length === 0
      ) {
        return []
      }
      return this.actions.map(a => {
        const program = pList.find(p => p.id === a.program_id)
        const chapter = cList.find(c => c.id === program.chapter_id)
        const sector = sList.find(s => s.id === a.sector_id)
        return {
          id: a.id,
          chapter_id: chapter.id,
          chapter: chapter.code + ' - ' + chapter.name,
          sector: sector.name,
          program:
            program.code_contract + program.code_function + program.code_number,
          code:
            program.code_contract +
            program.code_function +
            program.code_number +
            a.code,
          name: a.name
        }
      })
    }
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
      if (this.mentions.validate === 'Créer') {
        this.$store.dispatch(types.ADD_BUDGET_ACTION, {
          BudgetAction: this.action
        })
      } else {
        this.$store.dispatch(types.UPDATE_BUDGET_ACTION, {
          BudgetAction: this.action
        })
      }
      this.showActionDlg = false
    }
  }
}
</script>
