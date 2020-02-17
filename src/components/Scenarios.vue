<template>
  <v-card>
    <v-card-title class="secondary">
      <v-icon class="mr-2 black--text">playlist_add</v-icon>
      <div class="title">Scénarios</div>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="scenarios"
        class="elevation-1"
        :loading="loading"
        hide-default-footer
        dense
        no-data-text="Aucun scénario trouvé"
        no-results-text="Recherche infructueuse"
      >
        <template slot="item" slot-scope="props">
          <tr>
            <td class="text-center">
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    text
                    class="ma-0"
                    color="error"
                    @click.stop="onRemove(props.item)"
                    v-on="on"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </template>
                <span>Supprimer</span>
              </v-tooltip>
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    text
                    small
                    class="ma-0"
                    color="secondary"
                    @click.stop="onEdit(props.item)"
                    v-on="on"
                  >
                    <v-icon>edit</v-icon>
                  </v-btn>
                </template>
                <span>Modifier le titre</span>
              </v-tooltip>
            </td>
            <td>
              <router-link
                :to="{
                  name: 'Scenario',
                  params: {
                    scenario_id: props.item.id,
                    scenario_name: props.item.name
                  }
                }"
                class="table-link"
                >{{ props.item.name }}</router-link
              >
            </td>
            <td>{{ props.item.descript }}</td>
          </tr>
        </template>
      </v-data-table>
      <scenario-edit-dlg
        :mentions="mentions"
        :scenario="modifiedScenario"
        v-model="showDlg"
        @save="onSave"
      />
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" text @click.stop="onCreate">Ajouter</v-btn>
    </v-card-actions>
    <delete-dlg
      v-model="removeDlg"
      cat="le scénario"
      :name="deletedScenario.name"
      @confirm="onConfirmRmv"
    />
  </v-card>
</template>

<script>
import ScenarioEditDlg from './Scenarios/ScenarioEditDlg.vue'
import DeleteDlg from './DeleteDlg.vue'
import * as types from '../store/mutation-types'
export default {
  name: 'scenarios',
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    scenarios () {
      return this.$store.state.scenarios.scenarios
    }
  },
  data: () => ({
    headers: [
      { text: 'Action', value: 'action', align: 'center', sortable: false },
      { text: 'Nom', value: 'name', align: 'center', sortable: true },
      {
        text: 'Description',
        value: 'descript',
        align: 'center',
        sortable: true
      }
    ],
    showDlg: false,
    deletedScenario: null,
    removeDlg: null,
    modifiedScenario: null,
    mentions: { title: 'Nouveau scénario', validate: 'Créer' }
  }),
  components: { ScenarioEditDlg, DeleteDlg },
  methods: {
    onCreate () {
      this.mentions = { title: 'Nouveau scénario', validate: 'Créer' }
      this.modifiedScenario = { name: '', descript: null }
      this.showDlg = true
    },
    onEdit (item) {
      const s = this.scenarios.find(s => s.id === item.id)
      this.modifiedScenario = { ...s }
      this.mentions = { title: 'Mise à jour du scénario', validate: 'Modifier' }
      this.showDlg = true
    },
    onCancel () {
      this.showDlg = false
    },
    onSave () {
      if (this.mentions.validate === 'Créer') {
        this.$store.dispatch(types.ADD_SCENARIO, this.modifiedScenario)
      } else this.$store.dispatch(types.UPDATE_SCENARIO, this.modifiedScenario)
    },
    onRemove (item) {
      this.deletedScenario = this.scenarios.find(s => s.id === item.id)
      this.removeDlg = true
    },
    onConfirmRmv () {
      this.$store.dispatch(types.DEL_SCENARIO, this.deletedScenario)
      this.removeDlg = false
    },
    onCancelRmv () {
      this.removeDlg = false
    }
  },
  created () {
    this.$store.dispatch(types.GET_SCENARIOS)
  }
}
</script>
