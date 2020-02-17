<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex class="xs12 sm6 offset-sm3">
          <v-text-field
            append-icon="search"
            label="Recherche"
            single-line
            hide-details
            v-model="docSearch"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="docs"
            :search="docSearch"
            class="elevation-1"
            :loading="loading"
            dense
            no-data-text="Aucun document à afficher"
            no-results-text="Recherche infructueuse"
          >
            <template slot="item" slot-scope="props">
              <tr>
                <td class="px-0" color="primary">
                  <v-tooltip right v-if="!isObserver">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        @click="onModify(props.item)"
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
                <td class="tx-0">
                  <v-tooltip right v-if="!isObserver" color="error">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        @click="onDelete(props.item)"
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
                <td class="text-left">
                  <a :href="props.item.link" target="_blank" class="table-link">
                    {{
                    props.item.name
                    }}
                  </a>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions v-if="!isObserver" class="tertiary">
      <v-spacer />
      <v-btn color="primary" text @click="onCreate">Ajouter</v-btn>
    </v-card-actions>
    <document-dialog
      v-model="showDlg"
      :mentions="mentions"
      :document="modifiedDocument"
      @save="onSave"
    />
    <delete-dlg
      v-model="removeDlg"
      cal="le document"
      :name="delDocument.name"
      @confirm="onConfirmDel"
    />
  </v-card>
</template>

<script>
import * as types from '../../store/mutation-types'
import OpDocumentDlg from './OpDocumentDlg.vue'
import isObserver from '../Mixins/isObserver'
import DeleteDlg from '../DeleteDlg.vue'
export default {
  name: 'OpDocuments',
  props: { op: null },
  mixins: [isObserver],
  components: { 'document-dialog': OpDocumentDlg, DeleteDlg },
  data: () => ({
    removeDlg: false,
    showDlg: false,
    delDocument: { name: '', link: '' },
    modifiedDocument: { name: '', link: '' },
    mentions: { title: 'Modification du document', validate: 'Modifier' },
    headers: [
      { text: '', value: '', align: 'center', sortable: false, width: '1%' },
      { text: '', value: '', align: 'center', sortable: false, width: '1%' },
      { text: 'Document', value: 'name', align: 'center', sortable: true }
    ],
    docSearch: ''
  }),
  computed: {
    docs () {
      return this.$store.state.documents.documents
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    onCreate () {
      this.mentions = { title: 'Nouveau document', validate: 'Créer' }
      this.modifiedDocument = { name: '', link: '' }
      this.showDlg = true
    },
    onModify (item) {
      const d = this.docs.find(d => d.id === item.id)
      this.modifiedDocument = { ...d }
      this.mentions = {
        title: 'Modification du document',
        validate: 'Modifier'
      }
      this.showDlg = true
    },
    onDelete (item) {
      this.delDocument = this.docs.find(d => d.id === item.id)
      this.removeDlg = true
    },
    onCancel () {
      this.showDlg = false
    },
    onSave () {
      const action = this.mentions.validate === 'Créer'
        ? types.ADD_DOCUMENT
        : types.UPDATE_DOCUMENT
      this.$store.dispatch(action, {
        id: this.op.id,
        document: this.modifiedDocument
      })
    },
    onCancelDel () {
      this.removeDlg = false
    },
    onConfirmDel () {
      this.$store.dispatch(types.DEL_DOCUMENT, {
        id: this.op.id,
        document: this.delDocument
      })
      this.removeDlg = false
    }
  }
}
</script>
