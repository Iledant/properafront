<template>
  <v-card>
    <v-card-title class="secondary">Liens engagements / plans</v-card-title>
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 class="text-subtitle-1">Engagements non liés à un plan</v-flex>
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
            :items="fcItems"
            class="elevation-1"
            :loading="loading"
            :server-items-length="fcUPlNumber"
            :page.sync="fcPage"
            show-select
            v-model="fcSelected"
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
        <v-flex class="text-right">
          <v-btn
            text
            small
            @click="download"
            color="primary"
          >Télécharger tous les engagements non liés</v-btn>
        </v-flex>
        <v-flex xs12 class="text-center tertiary">
          <v-btn
            text
            small
            @click="link"
            color="primary"
            :disabled="linkDisabled"
          >Rattacher à la ligne de plan</v-btn>
        </v-flex>
        <v-flex xs12 sm6 offset-sm3>
          <v-autocomplete
            :items="plans"
            v-model="plan_id"
            label="Plan"
            class="pr-2"
            item-text="name"
            item-value="id"
            no-data-text="Aucun plan trouvé"
            prepend-icon="description"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs6 offset-sm3>
          <v-text-field
            prepend-icon="search"
            label="Recherche d'une ligne de plan"
            single-line
            hide-details
            v-model="plSearch"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :headers="plHeaders"
            :items="plList"
            class="elevation-1"
            :search="plSearch"
            :loading="loading"
            v-model="plSelected"
            no-data-text="Aucune opération"
            no-results-text="Aucune opération correspondant à la recherche"
            show-select
            single-select
            dense
          >
            <template #item.value="{ item }">
              <div class="text-right">{{ item.value | valueFilter }}</div>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="text-subtitle-1 mt-5">Engagements et lignes de plan liés</v-flex>
        <v-flex xs12 sm6>
          <v-text-field
            label="Recherche (code IRIS, nom IRIS, bénéficiaire, opération)"
            single-line
            hide-details
            v-debounce:500ms="handleFcPlSearch"
            prepend-icon="search"
          />
        </v-flex>
        <v-flex xs12 sm6>
          <v-text-field
            label="À partir de l'année"
            single-line
            hide-details
            v-debounce:500ms="handleFcPlMinYear"
            prepend-icon="calendar_today"
            :rules="[yearRule]"
          />
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="fcPlHeaders"
            :items="fcPlLinkedList"
            class="elevation-1"
            :loading="loading"
            :server-items-length="fcPlNumber"
            :page.sync="fcPlPage"
            show-select
            v-model="fcPlSelected"
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
  name: 'CmtPlanLinks',
  mixins: [yearRule],
  data: () => ({
    fcItems: [],
    fcPage: 1,
    fcSelected: [],
    fcSearch: '',
    fcMinYear: '',
    fcHeaders: [
      { text: 'Code IRIS', value: 'iris_code', sortable: false },
      { text: 'Libellé', value: 'name', sortable: false },
      { text: 'Bénéficiaire', value: 'beneficiary', sortable: false },
      { text: 'Date', value: 'fcDate', sortable: false },
      { text: 'Montant', value: 'fcValue', sortable: false }
    ],
    plSearch: '',
    plSelected: [],
    plan_id: null,
    plHeaders: [
      { text: 'Libellé', value: 'name', sortable: true },
      { text: 'Montant', value: 'value', sortable: true }
    ],
    fcPlPage: 1,
    fcPlSelected: [],
    fcPlSearch: '',
    fcPlMinYear: '',
    fcPlHeaders: [
      { text: 'Engagement', value: 'fcName', sortable: false },
      { text: 'Date', value: 'fcDate', sortable: false },
      { text: 'Montant', value: 'fcValue', sortable: false },
      { text: 'Bénéficiaire', value: 'fcBeneficiary', sortable: false },
      { text: 'Ligne de plan', value: 'plName', sortable: false }
    ]
  }),
  methods: {
    async getUnlinkedFc (page) {
      await this.$store.dispatch(types.GET_UNLINKED_FINANCIAL_COMMITMENTS, {
        page,
        search: this.fcSearch,
        minYear: this.fcMinYear,
        LinkType: 'PlanLine'
      })
      if (this.fcPage !== this.fcUPlPage) {
        this.fcPage = this.fcUPlPage
      }
    },
    async link () {
      if (!this.linkDisabled) {
        const fcIdList = this.fcSelected.map(fc => fc.id)
        const plId = this.plSelected[0].id
        await this.$store.dispatch(types.LINK_FINANCIAL_COMMITMENTS_PL, {
          plId: plId,
          fcIdList: fcIdList,
          search: this.fcSearch,
          minYear: this.fcMinYear
        })
        this.getPlFcLinked(this.fcPlPage)
        this.fcSelected = []
        this.plSelected = []
      }
    },
    async handleFcSearch (s) {
      this.fcSearch = s
      await this.getUnlinkedFc(1)
    },
    async handleFcMinYear (y) {
      if (yearTest(y)) {
        this.fcMinYear = y
        await this.getUnlinkedFc(1)
      }
    },
    async getPlFcLinked (page) {
      await this.$store.dispatch(types.GET_FC_LINKED, {
        page: page,
        search: this.fcPlSearch,
        minYear: this.fcPlMinYear,
        LinkType: 'PlanLine'
      })
      if (this.fcPlPage !== this.fcLPlPage) {
        this.fcPlPage = this.fcLPlPage
      }
    },
    async unlink () {
      if (!this.unlinkDisabled) {
        const fcIdList = this.fcPlSelected.map(l => l.id)
        await this.$store.dispatch(types.UNLINK_FC_LIST, {
          fcIdList,
          search: this.fcPlSearch,
          minYear: parseInt(this.fcPlMinYear),
          linkType: 'PlanLine'
        })
        this.getUnlinkedFc(this.fcPage)
        this.fcPlSelected = []
      }
    },
    async handleFcPlSearch (s) {
      this.fcPlSearch = s
      await this.getPlFcLinked(1)
    },
    async handleFcPlMinYear (y) {
      if (yearTest(y)) {
        this.fcPlMinYear = y
        await this.getPlFcLinked(1)
      }
    },
    async download () {
      await this.$store.dispatch(types.DOWNLOAD_ALL_PL_UNLINKED_COMMITMENTS)
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      plans: state => state.plans.plans,
      plList: state => state.planLines.planLines,
      fcPlUnlinkedList: state => state.previsions.fcPlUnlinkedList,
      fcUPlNumber: state => state.previsions.fcPlUnlinkedItemsCount,
      fcUPlPage: state => state.previsions.fcPlUnlinkedCurrentPageNumber,
      fcPlLinkedList: state => state.previsions.fcPlLinkedList.map(l => ({
        id: l.fcId,
        fcName: l.fcName,
        iris_code: l.iris_code,
        fcDate: l.fcDate,
        fcValue: l.fcValue,
        fcBeneficiary: l.fcBeneficiary,
        plName: l.plName
      })),
      fcLPlPage: state => state.previsions.fcPlLinkedCurrentPageNumber,
      fcPlNumber: state => state.previsions.fcPlLinkedItemsCount
    }),
    linkDisabled () {
      return !this.fcSelected.length || !this.plSelected.length
    },
    unlinkDisabled () {
      return !this.fcPlSelected.length
    }
  },
  created () {
    this.$store.dispatch(types.GET_PLANS)
    this.getUnlinkedFc(1)
    this.getPlFcLinked(1)
  },
  watch: {
    fcPlUnlinkedList (list) {
      this.fcItems = list.map(fc => {
        return {
          value: false,
          id: fc.id,
          iris_code: fc.iris_code,
          name: fc.name,
          beneficiary: fc.beneficiary,
          fcDate: fc.date,
          fcValue: fc.value
        }
      })
    },
    async fcPage (page) {
      if (page !== this.fcUPlPage) {
        await this.getUnlinkedFc(page)
      }
    },
    async fcPlPage (page) {
      if (page !== this.fcLPlPage) {
        await this.getPlFcLinked(page)
      }
    },
    plan_id (newPlanId) {
      if (newPlanId) {
        this.$store.dispatch(types.GET_PLAN_LINES, { id: newPlanId })
      }
    }
  }
}
</script>
