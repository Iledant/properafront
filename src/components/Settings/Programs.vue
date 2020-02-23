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
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :headers="programHeaders"
            dense
            :items="programs"
            class="elevation-1"
            :loading="loading"
            :search="search"
            no-data-text="Aucune ligne à afficher"
            no-results-text="Recherche infructueuse"
          >
            <template #item="{item}">
              <tr>
                <td class="px-0">
                  <v-btn
                    text
                    icon
                    small
                    class="ma-0"
                    color="secondary"
                    @click.native.stop="edit(item)"
                  >
                    <v-icon>edit</v-icon>
                  </v-btn>
                </td>
                <td class="px-0">
                  <v-btn
                    text
                    icon
                    small
                    class="ma-0"
                    color="error"
                    @click.native.stop="remove(item)"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
                <td>{{ item.chapter }}</td>
                <td>{{ item.subfunction }}</td>
                <td>{{ item.code }}</td>
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
    <program-edit-dlg
      v-model="showProgramDlg"
      :mentions="mentions"
      :BudgetProgram="program"
      @save="save"
    />
    <delete-dlg
      v-model="deleteDlg"
      cat="le programme"
      :name="`${deletedProgram.code} - ${deletedProgram.name}`"
      @confirm="confirmDelete"
    />
  </v-card>
</template>

<script>
import * as types from '../../store/mutation-types.js'
import ProgramEditDlg from '../BudgetTables/ProgramEditDlg.vue'
import DeleteDlg from '../DeleteDlg.vue'
import { mapGetters, mapState } from 'vuex'
const nullProgram = {
  id: 0,
  name: '',
  code_contract: '',
  code_function: '',
  code_number: '',
  chapter_id: null,
  subfunction: ''
}

export default {
  name: 'Programs',
  components: { ProgramEditDlg, DeleteDlg },
  data: () => ({
    mentions: { title: 'Nouveau programme', validate: 'Créer' },
    programHeaders: [
      { text: '', value: '', sortable: false, width: '1%' },
      { text: '', value: '', sortable: false, width: '1%' },
      { text: 'Chapitre', value: 'chapter' },
      { text: 'Sous-fonction', value: 'subfunction' },
      { text: 'Code programme', value: 'code' },
      { text: 'Intitulé', value: 'name' }
    ],
    search: '',
    deletedProgram: { ...nullProgram },
    deleteDlg: false,
    program: { ...nullProgram },
    showProgramDlg: false
  }),
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      chapters: state => state.budgetTables.chapterList,
      programList: state => state.budgetTables.programList
    }),
    programs () {
      return this.programList.map(p => {
        const chapter = this.chapters.find(c => c.id === p.chapter_id)
        return {
          id: p.id,
          chapter: chapter.code + ' - ' + chapter.name,
          subfunction: p.code_function + (p.code_subfunction || ''),
          code: p.code_contract + p.code_function + p.code_number,
          code_contract: p.code_contract,
          code_function: p.code_function,
          code_number: p.code_number,
          code_subfunction: p.code_subfunction,
          name: p.name,
          chapter_id: p.chapter_id
        }
      })
    }
  },
  methods: {
    remove (item) {
      this.deletedProgram = { ...item }
      this.deleteDlg = true
    },
    confirmDelete () {
      this.$store.dispatch(types.DEL_BUDGET_PROGRAM, {
        BudgetProgram: this.deletedProgram
      })
      this.deleteDlg = false
    },
    add () {
      this.program = { ...nullProgram }
      this.mentions = { title: 'Nouveau programme', validate: 'Créer' }
      this.showProgramDlg = true
    },
    edit (item) {
      this.program = { ...item }
      this.mentions = { title: 'Modifier le programme', validate: 'Modifier' }
      this.showProgramDlg = true
    },
    save () {
      if (this.mentions.validate === 'Créer') {
        this.$store.dispatch(types.ADD_BUDGET_PROGRAM, {
          BudgetProgram: this.program
        })
      } else {
        this.$store.dispatch(types.UPDATE_BUDGET_PROGRAM, {
          BudgetProgram: this.program
        })
      }
      this.showProgramDlg = false
    }
  }
}
</script>
