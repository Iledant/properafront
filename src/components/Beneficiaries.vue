<template>
  <v-card>
    <v-card-title class="secondary">Gestion des bénéficiaires</v-card-title>
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
            :items="beneficiaries"
            :search="search"
            dense
            class="elevation-1"
            no-data-text="Aucun bénéficiaire trouvé"
            no-results-text="Recherche infructueuse"
          >
            <template #item="{item}">
              <tr>
                <td class="px-0">
                  <v-tooltip right color="primary">
                    <template #activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        @click="edit(item)"
                        color="secondary"
                        v-on="on"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </template>
                    <span>Changer le nom</span>
                  </v-tooltip>
                </td>
                <td>{{ item.code }}</td>
                <td>{{ item.name }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <beneficiary-edit-dlg :beneficiary="item" v-model="showDlg" @save="save" />
  </v-card>
</template>

<script>
import * as types from '../store/mutation-types.js'
import BeneficiaryEditDlg from './Beneficiaries/BeneficiaryEditDlg.vue'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'Beneficiaries',
  components: { BeneficiaryEditDlg },
  data: () => ({
    search: '',
    headers: [
      { text: '', value: '', sortable: false, width: '1%' },
      { text: 'Code', value: 'code' },
      { text: 'Nom', value: 'name' }
    ],
    item: { code: 0, name: '' },
    showDlg: false
  }),
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      beneficiaries: state => state.beneficiaries.beneficiaries
    })
  },
  methods: {
    edit (item) {
      this.item = { ...item }
      this.showDlg = true
    },
    save () {
      this.$store.dispatch(types.UPDATE_BENEFICIARY,
        { id: this.item.id, name: this.item.name })
    }
  },
  created () {
    this.$store.dispatch(types.GET_BENEFICIARIES)
  }
}
</script>
