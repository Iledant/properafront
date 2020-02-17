<template>
  <v-card>
    <v-card-title class="secondary title">Plans</v-card-title>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field prepend-icon="search" label="Recherche" v-model="searchText" />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :loading="loading"
            :headers="headers"
            :items="plans"
            :search="searchText"
            dense
            class="elevation-1"
            no-data-text="Aucun plan"
            no-results-text="Recherche infructueuse"
          >
            <template slot="item" slot-scope="props">
              <tr>
                <td class="pr-0 pl-0">
                  <v-tooltip right v-if="isAdmin">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        @click="onModify(props.item.id)"
                        class="ma-0"
                        color="secondary"
                        v-on="on"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </template>
                    <span>Modifier</span>
                  </v-tooltip>
                </td>
                <td class="pr-0 pl-0">
                  <v-tooltip right v-if="isAdmin">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        @click="onDelete(props.item.id)"
                        class="ma-0"
                        color="error"
                        v-on="on"
                      >
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Supprimer</span>
                  </v-tooltip>
                </td>
                <td>
                  <router-link
                    :to="'/planLines/' + props.item.id"
                    class="table-link"
                  >{{ props.item.name }}</router-link>
                </td>
                <td>
                  <v-tooltip bottom max-width="500px" color="secondary grey--text text--darken-4">
                    <template v-slot:activator="{ on }">
                      <div v-on="on" class="font-italic">{{ props.item.descript | truncate }}</div>
                    </template>
                    <span>{{ props.item.descript }}</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn color="primary" text @click.stop="onAddClick" v-if="isAdmin">Ajouter</v-btn>
    </v-card-actions>
    <plan-edit-dlg v-model="showDlg" :mentions="mentions" @save="onSave" :plan="modifiedPlan" />
    <delete-dlg v-model="removeDlg" cat="le plan" :name="deletedPlan.name" @confirm="onConfirmRmv" />
  </v-card>
</template>

<script>
import * as types from '../store/mutation-types.js'
import PlanEditDlg from './Plans/PlanEditDlg'
import DeleteDlg from './DeleteDlg'
import isAdmin from './Mixins/isAdmin'

export default {
  name: 'Plans',
  mixins: [isAdmin],
  components: { PlanEditDlg, DeleteDlg },
  data: () => ({
    searchText: '',
    deletedPlan: {
      name: '',
      descript: null,
      first_year: null,
      last_year: null
    },
    showDlg: false,
    removeDlg: false,
    mentions: { title: 'Nouveau plan', validate: 'Créer' },
    headers: [
      { text: '', value: '', sortable: false, align: 'center', width: '1%' },
      { text: '', value: '', sortable: false, align: 'center', width: '1%' },
      { text: 'Nom', value: 'name', sortable: true, align: 'center' },
      {
        text: 'Description',
        value: 'descript',
        sortable: true,
        align: 'center'
      }
    ],
    modifiedPlan: {
      name: '',
      descript: null,
      first_year: null,
      last_year: null
    }
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    plans () {
      return this.$store.state.plans.plans
    }
  },
  methods: {
    onAddClick () {
      this.modifiedPlan = {
        name: '',
        descript: null,
        first_year: null,
        last_year: null
      }
      this.mentions = { title: 'Nouveau plan', validate: 'Créer' }
      this.showDlg = true
    },
    onModify (id) {
      const p = this.plans.find(p => p.id === id)
      this.modifiedPlan = { ...p }
      this.mentions = { title: 'Modifier le plan', validate: 'Modifier' }
      this.showDlg = true
    },
    onSave () {
      if (this.mentions.validate === 'Créer') {
        this.$store.dispatch(types.ADD_PLAN, { plan: this.modifiedPlan })
      } else {
        this.$store.dispatch(types.UPDATE_PLAN, { plan: this.modifiedPlan })
      }
    },
    onDelete (id) {
      this.deletedPlan = this.plans.find(p => p.id === id)
      this.removeDlg = true
    },
    onConfirmRmv () {
      this.$store.dispatch(types.DEL_PLAN, { plan: this.deletedPlan })
    }
  },
  created () {
    this.$store.dispatch(types.GET_PLANS)
  }
}
</script>
