<template>
  <v-card>
    <v-card-title class="secondary">Liens engagements / opérations</v-card-title>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 class="text-subtitle-1">Engagements non rattachés à une opération</v-flex>
        <v-flex xs12 sm6>
          <v-text-field
            label="Recherche (nom, bénéficiaire, code IRIS)"
            single-line
            hide-details
            v-debounce:500ms="handleFcSearch"
            prepend-icon="search"
          />
        </v-flex>
        <v-flex xs12 sm6>
          <v-text-field
            label="À partir de l'année"
            single-line
            hide-details
            v-debounce:500ms="handleFcMinYear"
            prepend-icon="calendar_today"
            :rules="[yearRule]"
          />
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="fcHeaders"
            :items="fcOpUnlinkedList"
            class="elevation-1"
            :loading="loading"
            :server-items-length="fcNumber"
            :page.sync="fcPage"
            show-select
            v-model="fcSelected"
            dense
            no-data-text="Aucun engagement à rattacher trouvé"
            no-results-text="Recherche infructueuse"
            :footer-props="{ disableItemsPerPage: true }"
          >
            <template #item.fcDate="{ item }">{{ item.fcDate | dateFilter }}</template>
            <template #item.fcValue="{ item }">
              <div class="text-no-wrap text-right">{{ item.fcValue | valueFilter }}</div>
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
        <v-flex xs12 class="text-subtitle-1 mt-5">Engagements et opérations liés</v-flex>
        <v-flex xs12 sm6>
          <v-text-field
            label="Recherche (code IRIS, nom IRIS, bénéficiaire, opération)"
            single-line
            hide-details
            v-debounce:500ms="handleFcOpSearch"
            prepend-icon="search"
          />
        </v-flex>
        <v-flex xs12 sm6>
          <v-text-field
            label="À partir de l'année"
            single-line
            hide-details
            v-debounce:500ms="handleFcOpMinYear"
            prepend-icon="calendar_today"
            :rules="[yearRule]"
          />
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="fcOpHeaders"
            :items="fcOpLinkedList"
            class="elevation-1"
            :loading="loading"
            :server-items-length="fcOpNumber"
            :page.sync="fcOpPage"
            show-select
            v-model="fcOpSelected"
            dense
            no-data-text="Aucun engagement à rattacher trouvé"
            no-results-text="Recherche infructueuse"
            :footer-props="{ disableItemsPerPage: true }"
          >
            <template #item.fcDate="{ item }">
              <div class="text-no-wrap">{{ item.fcDate | dateFilter }}</div>
            </template>
            <template #item.fcValue="{ item }">
              <div class="text-no-wrap text-right">{{ item.fcValue | valueFilter }}</div>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="text-right tertiary">
          <v-btn text small @click="download" color="primary">Télécharger tous les liens</v-btn>
          <v-btn
            text
            small
            @click="unlink"
            color="primary"
            :disabled="unlinkDisabled"
          >Supprimer le lien</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import * as types from '@/store/mutation-types'
import yearRule from '@/components/Mixins/yearRule'
import { mapGetters, mapState } from 'vuex'
const yearTest = y => /^20\d{2}$/.test(y)
export default {
  name: 'CmtOpLinks',
  mixins: [yearRule],
  data: () => ({
    fcItems: [],
    fcSearch: '',
    fcMinYear: '',
    fcPage: 1,
    fcSelected: [],
    fcHeaders: [
      { text: 'Code IRIS', value: 'iris_code', sortable: false },
      { text: 'Libellé', value: 'name', sortable: false },
      { text: 'Bénéficiaire', value: 'beneficiary', sortable: false },
      { text: 'Date', value: 'fcDate', sortable: false },
      { text: 'Montant', value: 'fcValue', sortable: false }
    ],
    opSelected: [],
    opSearch: '',
    opHeaders: [
      { text: 'Numéro', value: 'number' },
      { text: 'Libellé', value: 'name' }
    ],
    fcOpSearch: '',
    fcOpMinYear: '',
    fcOpPage: 1,
    fcOpSelected: [],
    fcOpHeaders: [
      { text: 'Engagement', value: 'fcName', sortable: false },
      { text: 'Date', value: 'fcDate', sortable: false },
      { text: 'Montant', value: 'fcValue', sortable: false },
      { text: 'Bénéficiaire', value: 'fcBeneficiary', sortable: false },
      { text: 'Opération', value: 'opName', sortable: false }
    ]
  }),
  methods: {
    async getUnlinkedFC (page) {
      await this.$store.dispatch(types.GET_UNLINKED_FINANCIAL_COMMITMENTS, {
        page,
        search: this.fcSearch,
        minYear: this.fcMinYear,
        LinkType: 'PhysicalOp'
      })
      if (this.fcPage !== this.fcUOpPage) {
        this.fcPage = this.fcUOpPage
      }
    },
    async link () {
      if (!this.linkDisabled) {
        const fcIdList = this.fcSelected.map(fc => fc.id)
        const opId = this.opSelected[0].id
        await this.$store.dispatch(types.LINK_FINANCIAL_COMMITMENTS, {
          opId,
          fcIdList,
          search: this.fcSearch,
          minYear: this.fcMinYear
        })
        this.getOpFcLinked(this.fcOpPage)
        this.fcSelected = []
        this.opSelected = []
      }
    },
    async handleFcSearch (s) {
      this.fcSearch = s
      await this.getUnlinkedFC(1)
    },
    async handleFcMinYear (y) {
      if (yearTest(y)) {
        this.minYear = y
        await this.getUnlinkedFC(1)
      }
    },
    async getOpFcLinked (page) {
      await this.$store.dispatch(types.GET_FC_LINKED, {
        page: page,
        search: this.fcOpSearch,
        minYear: this.fcOpMinYear,
        LinkType: 'PhysicalOp'
      })
      if (this.fcOpPage !== this.fcLOpPage) {
        this.fcOpPage = this.fcLOpPage
      }
    },
    async unlink () {
      if (!this.unlinkDisabled) {
        const fcIdList = this.fcOpSelected.map(l => l.id)
        await this.$store.dispatch(types.UNLINK_FC_LIST, {
          fcIdList,
          search: this.fcOpSearch,
          minYear: parseInt(this.fcOpMinYear),
          linkType: 'PhysicalOp'
        })
        this.getUnlinkedFC(this.fcPage)
        this.fcOpSelected = []
      }
    },
    async handleFcOpSearch (s) {
      this.fcOpSearch = s
      await this.getOpFcLinked(1)
    },
    async handleFcOpMinYear (y) {
      if (yearTest(y)) {
        this.fcOpMinYear = y
        await this.getOpFcLinked(1)
      }
    },
    download () {
      this.$store.dispatch(types.GET_PHYSICAL_OPS_FINANCIAL_COMMITMENTS)
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      opList: s => s.physops.ops,
      fcOpUnlinkedList: s => s.previsions.fcOpUnlinkedList,
      fcNumber: s => s.previsions.fcOpUnlinkedItemsCount,
      fcUOpPage: s => s.previsions.fcOpUnlinkedCurrentPageNumber,
      fcLOpPage: s => s.previsions.fcOpLinkedCurrentPageNumber,
      fcOpNumber: s => s.previsions.fcOpLinkedItemsCount,
      fcOpLinkedList: s => s.previsions.fcOpLinkedList.map(l => ({
        id: l.fcId,
        fcName: l.fcName,
        iris_code: l.iris_code,
        fcDate: l.fcDate,
        fcValue: l.fcValue,
        fcBeneficiary: l.fcBeneficiary,
        opName: l.opName,
        opNumber: l.opNumber
      }))
    }),
    linkDisabled () {
      return !this.fcSelected || !this.opSelected.length
    },
    unlinkDisabled () {
      return !this.fcOpSelected.length
    }
  },
  created () {
    this.$store.dispatch(types.GET_PHYSICAL_OPS)
    this.getUnlinkedFC(1)
    this.getOpFcLinked(1)
  },
  watch: {
    async fcPage (page) {
      if (page !== this.fcUOpPage) {
        await this.getUnlinkedFc(page)
      }
    },
    async fcOpPage (page) {
      if (page !== this.fcLOpPage) {
        await this.getOpFcLinked(page)
      }
    }
  }
}
</script>
