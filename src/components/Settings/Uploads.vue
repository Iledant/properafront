<template>
  <v-card>
    <v-card-title class="secondary">Imports de fichiers</v-card-title>
    <v-container grid-list-md fluid>
      <v-layout row wrap align-baseline>
        <v-flex xs12 md6 offset-md3>
          <v-autocomplete
            :items="items"
            label="Sélectionner le type de données à importer"
            v-model="selected" />
        </v-flex>
        <v-flex xs12>
          <component v-if="selected" :is="selected" />
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import * as types from '@/store/mutation-types'
import CmtUpload from './Uploads/CmtUpload.vue'
import PmtUpload from './Uploads/PmtUpload.vue'
import PendingCmtUpload from './Uploads/PendingCmtUpload.vue'
import PmtDemandUpload from './Uploads/PmtDemandUpload.vue'
import OpsUpload from './Uploads/OpsUpload.vue'
import CmtPrevUpload from './Uploads/CmtPrevUpload.vue'
import ProgUpload from './Uploads/ProgUpload.vue'
import OpCmtLinksUpload from './Uploads/OpCmtLinksUpload.vue'
import ProgramUpload from './Uploads/ProgramUpload.vue'
import ActionUpload from './Uploads/ActionUpload.vue'
import CreditsUpload from './Uploads/CreditsUpload.vue'
import PlanLineUpload from './Uploads/PlanLineUpload.vue'
import PmtCreditsUpload from './Uploads/PmtCreditsUpload.vue'
import PmtCreditsJournalUpload from './Uploads/PmtCreditsJournalUpload.vue'

export default {
  name: 'Uploads',
  data () {
    return {
      planId: null,
      dlg: false,
      date: null,
      menu: false,
      selected: null,
      items: [
        { text: 'Paiements', value: PmtUpload },
        { text: 'Engagements', value: CmtUpload },
        { text: 'Dossiers en cours', value: PendingCmtUpload },
        { text: 'Demandes de paiement (DVS)', value: PmtDemandUpload },
        { text: 'Enveloppes d\'AP, MER, gels', value: CreditsUpload },
        { text: 'Enveloppes de CP', value: PmtCreditsUpload },
        { text: 'Mouvement des enveloppes de CP', value: PmtCreditsJournalUpload },
        { text: 'Opérations', value: OpsUpload },
        { text: 'Lignes de plan', value: PlanLineUpload },
        { text: 'Besoins', value: CmtPrevUpload },
        { text: 'Programmation', value: ProgUpload },
        { text: 'Liens engagement / opération', value: OpCmtLinksUpload },
        { text: 'Programmes budgétaires', value: ProgramUpload },
        { text: 'Actions budgétaires', value: ActionUpload }
      ]
    }
  },
  created () {
    this.$store.dispatch(types.GET_PLANS)
  }
}
</script>
