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
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="chapters"
            class="elevation-1 mt-2 mb-2"
            :loading="loading"
            dense
            no-data-text="Aucune ligne à afficher"
            no-results-text="Recherche infructueuse"
            :search="search"
          >
            <template v-slot:item="{item}">
              <tr>
                <td class="pa-0">
                  <v-btn text icon small class="ma-0" @click="edit(item)" color="secondary">
                    <v-icon>edit</v-icon>
                  </v-btn>
                </td>
                <td class="pa-0">
                  <v-btn text icon small class="ma-0" @click="remove(item)" color="error">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
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
      <v-btn color="primary" text @click="onChapAdd">Ajouter</v-btn>
    </v-card-actions>
    <chapter-edit-dlg
      v-model="showChapterDlg"
      :mentions="mentions"
      :BudgetChapter="chapter"
      @save="onChapterSave($event)"
    />
    <delete-dlg
      v-model="deleteDlg"
      cat="le chapitre"
      :name="`${deletedChap.code} - ${deletedChap.name}`"
      @confirm="confirmDelete"
    />
  </v-card>
</template>

<script>
import * as types from '../../store/mutation-types.js'
import ChapterEditDlg from '../BudgetTables/ChapterEditDlg.vue'
import DeleteDlg from '../DeleteDlg.vue'
export default {
  name: 'Chapters',
  components: { ChapterEditDlg, DeleteDlg },
  data: () => ({
    mentions: { title: 'Nouveau chapitre', validate: 'Créer' },
    headers: [
      { text: '', value: '', align: 'center', sortable: false, width: '1%' },
      { text: '', value: '', align: 'center', sortable: false, width: '1%' },
      { text: 'Code', value: 'code', align: 'center', sortable: true },
      { text: 'Intitulé', value: 'name', align: 'center', sortable: true }
    ],
    search: '',
    deletedChap: { id: 0, name: '', code: '' },
    deleteDlg: false,
    chapter: { id: 0, name: '', code: '' },
    showChapterDlg: false
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    chapters () {
      return this.$store.state.budgetTables.chapterList
    }
  },
  methods: {
    remove (item) {
      this.deletedChap = this.chapters.find(c => c.id === item.id)
      this.deleteDlg = true
    },
    confirmDelete () {
      this.$store.dispatch(types.DEL_BUDGET_CHAPTER, {
        BudgetChapter: this.deletedChap
      })
      this.deleteDlg = false
    },
    onChapAdd () {
      this.chapter = { id: 0, name: '', code: '' }
      this.mentions = { title: 'Nouveau chapitre', validate: 'Créer' }
      this.showChapterDlg = true
    },
    edit (item) {
      const found = this.chapters.find(c => c.id === item.id)
      this.chapter = { ...found }
      this.mentions = { title: 'Modifier le chapitre', validate: 'Modifier' }
      this.showChapterDlg = true
    },
    onChapterSave () {
      const dispatch =
        this.mentions.validate === 'Créer'
          ? types.ADD_BUDGET_CHAPTER
          : types.UPDATE_BUDGET_CHAPTER
      const BudgetChapter = {
        id: this.chapter.id,
        name: this.chapter.name,
        code: parseInt(this.chapter.code)
      }
      this.$store.dispatch(dispatch, { BudgetChapter })
      this.showChapterDlg = false
    }
  }
}
</script>
