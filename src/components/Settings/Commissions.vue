<template>
  <v-card>
    <v-card-title class="title secondary">Gestion des commissions</v-card-title>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            label="Recherche"
           single-line
           hide-details
           prepend-icon="search"
           v-model="search" />
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :loading="loading"
            :headers="headers"
            :items="commissions"
            dense
            :search="search"
            class="elevation-1"
            no-data-text="Aucune commission trouvée"
            no-results-text="Recherche infructueuse"
          >
            <template #item="{item}">
              <tr>
                <td class="pr-0 pl-0">
                  <v-tooltip right>
                    <template #activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        @click.stop="edit(item)"
                        class="ma-0"
                        v-on="on"
                        color="secondary"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </template>
                    <span>Modifier la commission</span>
                  </v-tooltip>
                </td>
                <td class="pr-0 pl-0">
                  <v-tooltip right>
                    <template #activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        @click.stop="remove(item)"
                        class="ma-0"
                        v-on="on"
                        color="error"
                      >
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Supprimer la commission</span>
                  </v-tooltip>
                </td>
                <td>{{ item.date | dateFilter }}</td>
                <td>{{ item.name }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn text color="primary" @click="add">Créer une commission</v-btn>
    </v-card-actions>
    <CommissionDlg
      :Commission="modifiedCommission"
      v-model="showCommissionDlg"
      :mentions="mentions"
      @save="save"
    />
    <delete-dlg
      v-model="removeDlg"
      cat="la commission"
      :name="deletedCommission.name"
      @confirm="confirmDelete"
    />
  </v-card>
</template>

<script>
import * as types from '@/store/mutation-types.js'
import CommissionDlg from './Commissions/CommissionDlg.vue'
import DeleteDlg from '@/components/DeleteDlg.vue'
import { mapGetters, mapState } from 'vuex'
const nullCommission = { id: 0, name: '', date: null }
export default {
  name: 'Commissions',
  components: { CommissionDlg, DeleteDlg },
  data: () => ({
    search: '',
    headers: [
      { text: '', value: '', sortable: false, width: '1%' },
      { text: '', value: '', sortable: false, width: '1%' },
      { text: 'Date', value: 'date' },
      { text: 'Nom', value: 'name' }
    ],
    modifiedCommission: { ...nullCommission },
    mentions: { title: 'Modifier la commission', validate: 'Modifier' },
    showCommissionDlg: false,
    removeDlg: false,
    deletedCommission: { ...nullCommission }
  }),
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      commissions: state => state.programmings.commissions
    })
  },
  methods: {
    edit (item) {
      this.modifiedCommission = { ...item }
      this.mentions = { title: 'Modifier la commission', validate: 'Modifier' }
      this.showCommissionDlg = true
    },
    add () {
      this.mentions = { title: 'Créer une commission', validate: 'Créer' }
      this.modifiedCommission = { ...nullCommission }
      this.showCommissionDlg = true
    },
    save () {
      const Commission = {
        id: this.modifiedCommission.id,
        name: this.modifiedCommission.name,
        date: new Date(this.modifiedCommission.date)
      }
      if (this.mentions.validate === 'Créer') {
        this.$store.dispatch(types.ADD_COMMISSION, { Commission })
      } else this.$store.dispatch(types.UPDATE_COMMISSION, { Commission })
    },
    remove (item) {
      this.deletedCommission = { ...item }
      this.removeDlg = true
    },
    confirmDelete () {
      this.$store.dispatch(types.DEL_COMMISSION, {
        Commission: this.deletedCommission
      })
      this.removeDlg = false
    }
  },
  created () {
    this.$store.dispatch(types.GET_COMMISSIONS)
  }
}
</script>
