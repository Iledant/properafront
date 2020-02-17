<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex class="xs12 sm6 offset-sm3">
          <v-text-field
            append-icon="search"
            class="pb-3"
            label="Recherche"
            single-line
            hide-details
            v-model="eventSearch"
          />
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="events"
            class="elevation-1"
            dense
            :loading="loading"
            no-data-text="Aucun événement à afficher"
            no-results-text="Recherche infructueuse"
          >
            <template v-slot:item="{item}">
              <tr>
                <td class="text-center px-0">
                  <v-tooltip right v-if="!isObserver">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        text
                        small
                        @click.stop="onModify(item.id)"
                        class="pa-0"
                        color="secondary"
                        v-on="on"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </template>
                    <span>Modifier</span>
                  </v-tooltip>
                </td>
                <td class="text-center px-0">
                  <v-tooltip right v-if="!isObserver">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        text
                        small
                        @click.stop="onDelete(item.id)"
                        class="pa-0"
                        color="error"
                        v-on="on"
                      >
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Supprimer</span>
                  </v-tooltip>
                </td>
                <td class="text-center">{{ item.date | dateFilter }}</td>
                <td class="text-left">{{ item.name }}</td>
                <td class="text-left">{{ item.descript }}</td>
                <td class="text-center">{{ item.iscertain | yesNoFilter }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
      <event-dialog
        :mentions="mentions"
        :event="modifiedEvent"
        v-model="showDlg"
        @save="onSave($event)"
      />
    </v-container>
    <v-card-actions v-if="!isObserver" class="tertiary">
      <v-spacer />
      <v-btn text color="primary" @click="onCreate">Ajouter</v-btn>
    </v-card-actions>
    <delete-dlg
      v-model="removeDlg"
      cal="l'événement"
      :name="deletedEvent ? deletedEvent.name : ''"
      @confirm="onConfirmDel"
    />
  </v-card>
</template>

<script>
import * as types from '../../store/mutation-types'
import OpEventDlg from './OpEventDlg.vue'
import isObserver from '../Mixins/isObserver'
import DeleteDlg from '../DeleteDlg.vue'
export default {
  name: 'OpEvents',
  props: { op: null },
  mixins: [isObserver],
  components: { 'event-dialog': OpEventDlg, DeleteDlg },
  data: () => ({
    removeDlg: false,
    showDlg: false,
    deletedEvent: null,
    modifiedEvent: null,
    mentions: { title: 'Modification de l\'événement', validate: 'Modifier' },
    headers: [
      { text: '', value: '', align: 'center', width: '1%', sortable: false },
      { text: '', value: '', align: 'center', width: '1%', sortable: false },
      { text: 'Date', value: 'date', align: 'center' },
      { text: 'Nom', value: 'name', align: 'center' },
      { text: 'Description', value: 'descript', align: 'center' },
      { text: 'Certain', value: 'isCertain', align: 'center' }
    ],
    eventSearch: ''
  }),
  computed: {
    events () {
      return this.$store.state.physops.events
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    onModify (id) {
      const e = this.$store.state.physops.events.find(e => e.id === id)
      this.modifiedEvent = {
        id: e.id,
        name: e.name,
        date: e.date,
        iscertain: e.iscertain,
        descript: e.descript
      }
      this.mentions = {
        title: 'Modification de l\'événement',
        validate: 'Modifier'
      }
      this.showDlg = true
    },
    onSave () {
      const action = this.mentions.validate === 'Créer'
        ? types.ADD_EVENT
        : types.UPDATE_EVENT
      const { date, ...others } = this.modifiedEvent
      this.$store.dispatch(action, {
        id: this.op.id,
        event: { date: new Date(date), ...others }
      })
    },
    onCreate () {
      this.mentions = { title: 'Nouvel événement', validate: 'Créer' }
      this.modifiedEvent = {
        id: 0,
        name: '',
        date: new Date().toISOString(),
        iscertain: false,
        descript: null
      }
      this.showDlg = true
    },
    onDelete (id) {
      this.deletedEvent = this.$store.state.physops.events.find(
        e => e.id === id
      )
      this.removeDlg = true
    },
    onConfirmDel () {
      this.$store.dispatch(types.DEL_EVENT, {
        id: this.op.id,
        event: this.deletedEvent
      })
      this.removeDlg = false
    }
  }
}
</script>
