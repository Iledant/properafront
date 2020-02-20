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
            :headers="sectorHeaders"
            :items="sectors"
            class="elevation-1 mt-2 mb-2"
            :loading="loading"
            :search="search"
            dense
            no-data-text="Aucune ligne à afficher"
            no-results-text="Recherche infructueuse"
          >
            <template v-slot:item="{item}">
              <tr>
                <td class="pa-0">
                  <v-btn icon text small class="pa-0" @click="edit(item)" color="secondary">
                    <v-icon>edit</v-icon>
                  </v-btn>
                </td>
                <td class="pa-0">
                  <v-btn text icon small class="pa-0" @click="remove(item)" color="error">
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
export default {
  name: 'Sectors',
  components: { SectorEditDlg, DeleteDlg },
  data: () => ({
    mentions: { title: 'Nouveau secteur', validate: 'Créer' },
    sectorHeaders: [
      { text: '', value: 'action', sortable: false, width: '1%' },
      { text: '', value: 'action', sortable: false, width: '1%' },
      { text: 'Code', value: 'code', align: 'center', sortable: true },
      { text: 'Intitulé', value: 'name', align: 'center', sortable: true }
    ],
    search: '',
    deletedSector: { id: 0, name: '', code: '' },
    sectorDeleteDlg: false,
    sector: { id: 0, name: '', code: '' },
    showSectorDlg: false
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    sectors () {
      return this.$store.state.budgetTables.sectorList
    }
  },
  methods: {
    remove (item) {
      this.deletedSector = this.sectors.find(c => c.id === item.id)
      this.sectorDeleteDlg = true
    },
    confirmDelete () {
      this.$store.dispatch(types.DEL_BUDGET_SECTOR, {
        BudgetSector: this.deletedSector
      })
      this.sectorDeleteDlg = false
    },
    add () {
      this.sector = { id: 0, name: '', code: '' }
      this.mentions = { title: 'Nouveau secteur', validate: 'Créer' }
      this.showSectorDlg = true
    },
    edit (item) {
      const s = this.sectors.find(c => c.id === item.id)
      this.sector = { ...s }
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
