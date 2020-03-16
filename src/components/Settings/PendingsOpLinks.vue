<template>
  <v-card>
    <v-card-title class="secondary">
        Liens dossiers en cours / opérations
      </v-card-title>
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 class="subtitle-1">
          Dossiers en cours non liés à une opération
        </v-flex>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            label="Recherche (nom, bénéficiaire, code IRIS)"
            single-line
            hide-details
            v-model="search"
            prepend-icon="search"
          />
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="fcHeaders"
            :items="fcItems"
            class="elevation-1"
            :loading="loading"
            show-select
            :search="search"
            v-model="fcSelected"
            dense
            no-data-text="Aucun engagement à rattacher trouvé"
            no-results-text="Recherche infructueuse"
          >
            <template #item.fcDate="{ item }">
              <div class="text-no-wrap">{{ item.fcDate | dateFilter }}</div>
            </template>
            <template #item.fcValue="{ item }">
              <div class="text-no-wrap text-right">
                {{ item.fcValue | valueFilter }}
              </div>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="text-center tertiary">
          <v-btn
            text
            small
            @click="link"
            color="primary"
            :disabled="linkDisabled"
          >Rattacher à l'opération</v-btn>
        </v-flex>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            prepend-icon="search"
            label="Recherche d'opération"
            single-line
            hide-details
            v-model="opSearch"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :headers="opHeaders"
            :items="opList"
            class="elevation-1"
            :search="opSearch"
            :loading="loading"
            no-data-text="Aucune opération"
            no-results-text="Recherche infructueuse"
            show-select
            v-model="opSelected"
            dense
            single-select
          />
        </v-flex>
        <v-flex xs12 class="subtitle-1 mt-5">
          Dossiers en cours et opérations liés
        </v-flex>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            label="Recherche"
            single-line
            hide-details
            v-model="opPdgSearch"
            prepend-icon="search"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :headers="opPdgHeaders"
            :items="opPdgLinkedList"
            class="elevation-1"
            :loading="loading"
            show-select
            v-model="opPdgSelected"
            :search="opPdgSearch"
            dense
            no-data-text="Aucun engagement à rattacher trouvé"
            no-results-text="Recherche infructueuse"
          >
            <template #item.commission_date="{ item }">
              <div class="text-no-wrap">
                {{ item.commission_date | dateFilter }}
              </div>
            </template>
            <template #item.proposed_value="{ item }">
              <div class="text-no-wrap text-right">
                {{ item.proposed_value | valueFilter }}
              </div>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="text-right tertiary">
          <v-btn
            text
            small
            @click="unlink"
            color="primary"
            :disabled="unlinkDisabled"
          >
            Supprimer le lien
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import * as types from '@/store/mutation-types'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'PendingsOpLinks',
  data: () => ({
    fcSelected: [],
    search: '',
    fcHeaders: [
      { text: 'Code IRIS', value: 'iris_code', sortable: false },
      { text: 'Libellé', value: 'name', sortable: false },
      { text: 'Bénéficiaire', value: 'beneficiary', sortable: false },
      { text: 'Date', value: 'fcDate', sortable: false },
      { text: 'Montant', value: 'fcValue', align: 'right', sortable: false }
    ],
    opSelected: [],
    opSearch: '',
    opHeaders: [
      { text: 'Numéro', value: 'number' },
      { text: 'Libellé', value: 'name' }
    ],
    opPdgSearch: '',
    opPdgSelected: [],
    opPdgHeaders: [
      { text: 'Engagement', value: 'name', sortable: false },
      { text: 'Date', value: 'commission_date', sortable: false },
      { text: 'Montant', value: 'proposed_value', align: 'right', sortable: false },
      { text: 'Bénéficiaire', value: 'beneficiary', sortable: false },
      { text: 'Opération', value: 'op_name', sortable: false }
    ]
  }),
  methods: {
    async link () {
      if (!this.linkDisabled) {
        const peIdList = this.fcSelected.map(f => f.id)
        const opId = this.opSelected[0].id
        await this.$store.dispatch(types.LINK_PENDING_COMMITMENTS,
          { opId, peIdList })
        await this.$store.dispatch(types.GET_LINKED_PENDING_COMMITMENTS)
        this.fcSelected = []
        this.opSelected = []
      }
    },
    async unlink () {
      if (!this.unlinkDisabled) {
        const peIdList = this.opPdgSelected.map(l => l.id)
        await this.$store.dispatch(types.UNLINK_PENDINGS_LIST, { peIdList })
        await this.$store.dispatch(types.GET_UNLINKED_PENDING_COMMITMENTS)
        this.opPdgSelected = []
      }
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      fcItems: state => state.previsions.unlinkedPendingsList,
      opList: state => state.physops.ops,
      opPdgLinkedList: state => state.previsions.linkedPendingsList
    }),
    linkDisabled () {
      return !this.fcSelected.length || !this.opSelected.length
    },
    unlinkDisabled () {
      return !this.opPdgSelected.length
    }
  },
  created () {
    this.$store.dispatch(types.GET_OP_PENDING_COMMITMENTS_DATAS)
  }
}
</script>
