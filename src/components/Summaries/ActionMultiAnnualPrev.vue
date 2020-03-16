<template>
  <v-card>
    <v-card-title class="secondary">
      Prévisions triennales AP par actions budgétaires
    </v-card-title>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12>
          <p>
            La synthèse ne contient que les chiffres par actions, le détail
            fournit la liste des opérations pour permettre de faire des contrôles.
          </p>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn color="primary" text @click="APDownload">Synthèse</v-btn>
      <v-btn color="primary" text @click="detailedAPDownload">Détail</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as types from '@/store/mutation-types'
export default {
  name: 'ActionMultiAnnualPrev',
  data () {
    return {
      actualYear: new Date().getFullYear()
    }
  },
  methods: {
    APDownload () {
      this.$store.dispatch(types.DOWNLOAD_COMMITMENT_PER_ACTION,
        { firstYear: this.actualYear + 1 })
    },
    detailedAPDownload () {
      this.$store.dispatch(types.DOWNLOAD_DETAILED_COMMITMENT_PER_ACTION,
        { firstYear: this.actualYear + 1 })
    }
  }
}
</script>
