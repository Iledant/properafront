<template>
  <v-card>
    <v-card-title class="secondary">Plans</v-card-title>
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
            <template #item="{ item }">
              <tr>
                <td class="px-0">
                  <v-tooltip right v-if="isAdmin">
                    <template #activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        @click="onModify(item)"
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
                <td class="px-0">
                  <v-tooltip right v-if="isAdmin">
                    <template #activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        @click="onDelete(item)"
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
                    :to="'/planLines/' + item.id"
                    class="table-link"
                  >{{ item.name }}</router-link>
                </td>
                <td>
                  <v-tooltip
                    bottom max-width="500px"
                    color="secondary grey--text text--darken-4"
                  >
                    <template #activator="{ on }">
                      <div v-on="on" class="font-italic">
                        {{ item.descript | truncate }}
                      </div>
                    </template>
                    <span>{{ item.descript }}</span>
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
      <v-btn color="primary" text @click.stop="onAddClick" v-if="isAdmin">
        Ajouter
      </v-btn>
    </v-card-actions>
    <plan-edit-dlg
      v-model="showDlg"
      :mentions="mentions"
      @save="onSave"
      :plan="modifiedPlan"
    />
    <delete-dlg
      v-model="removeDlg"
      cat="le plan"
      :name="deletedPlan.name"
      @confirm="onConfirmRmv"
    />
  </v-card>
</template>

<script>
import * as types from '../store/mutation-types.js'
import PlanEditDlg from './Plans/PlanEditDlg'
import DeleteDlg from './DeleteDlg'
import isAdmin from './Mixins/isAdmin'
import { mapGetters, mapState } from 'vuex'

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
      { text: '', value: '', sortable: false, width: '1%' },
      { text: '', value: '', sortable: false, width: '1%' },
      { text: 'Nom', value: 'name' },
      { text: 'Description', value: 'descript' }
    ],
    modifiedPlan: {
      name: '',
      descript: null,
      first_year: null,
      last_year: null
    }
  }),
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      plans: state => state.plans.plans
    })
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
    onModify (item) {
      this.modifiedPlan = { ...item }
      this.mentions = { title: 'Modifier le plan', validate: 'Modifier' }
      this.showDlg = true
    },
    onSave () {
      const action = this.mentions.validate === 'Créer'
        ? types.ADD_PLAN
        : types.UPDATE_PLAN
      this.$store.dispatch(action, { plan: this.modifiedPlan })
    },
    onDelete (item) {
      this.deletedPlan = { ...item }
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
