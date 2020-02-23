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
            :headers="headers"
            :items="sectors"
            class="elevation-1 mt-2 mb-2"
            :loading="loading"
            :search="search"
            dense
            no-data-text="Aucune ligne à afficher"
            no-results-text="Recherche infructueuse"
          >
            <template #item="{item}">
              <tr>
                <td class="pa-0">
                  <v-btn icon text small @click="edit(item)" color="secondary">
                    <v-icon>edit</v-icon>
                  </v-btn>
                </td>
                <td class="pa-0">
                  <v-btn text icon small @click="remove(item)" color="error">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
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
    <sector-edit-dlg
      v-model="showSectorDlg"
      :mentions="mentions"
      :BudgetSector="sector"
      @save="onSectorSave"
    />
    <delete-dlg
      v-model="sectorDeleteDlg"
      cat="le secteur"
      :name="`${deletedSector.code} - ${deletedSector.name}`"
      @confirm="confirmDelete"
    />
  </v-card>
</template>

<script>
import * as types from '../../store/mutation-types.js'
import SectorEditDlg from '../BudgetTables/SectorEditDlg.vue'
import DeleteDlg from '../DeleteDlg.vue'
import { mapGetters, mapState } from 'vuex'
const nullSector = { id: 0, name: '', code: '' }
export default {
  name: 'Sectors',
  components: { SectorEditDlg, DeleteDlg },
  data: () => ({
    mentions: { title: 'Nouveau secteur', validate: 'Créer' },
    headers: [
      { text: '', value: 'action', sortable: false, width: '1%' },
      { text: '', value: 'action', sortable: false, width: '1%' },
      { text: 'Code', value: 'code' },
      { text: 'Intitulé', value: 'name' }
    ],
    search: '',
    deletedSector: { ...nullSector },
    sectorDeleteDlg: false,
    sector: { ...nullSector },
    showSectorDlg: false
  }),
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      sectors: state => state.budgetTables.sectorList
    })
  },
  methods: {
    remove (item) {
      this.deletedSector = { ...item }
      this.sectorDeleteDlg = true
    },
    confirmDelete () {
      this.$store.dispatch(types.DEL_BUDGET_SECTOR, {
        BudgetSector: this.deletedSector
      })
      this.sectorDeleteDlg = false
    },
    add () {
      this.sector = { ...nullSector }
      this.mentions = { title: 'Nouveau secteur', validate: 'Créer' }
      this.showSectorDlg = true
    },
    edit (item) {
      this.sector = { ...item }
      this.mentions = { title: 'Modifier le secteur', validate: 'Modifier' }
      this.showSectorDlg = true
    },
    onSectorSave () {
      const action = this.mentions.validate === 'Créer'
        ? types.ADD_BUDGET_SECTOR
        : types.UPDATE_BUDGET_SECTOR
      this.$store.dispatch(action, { BudgetSector: this.sector })
      this.showSectorDlg = false
    }
  }
}
</script>
