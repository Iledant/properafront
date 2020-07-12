<template>
  <v-layout row wrap>
    <v-flex xs12 sm6>
      <v-select
        :items="plans"
        v-model="planId"
        label="Plan"
        item-value="id"
        item-text="name"
        single-line
      />
      <v-file-input
        label="Télécharger"
        @change="checkFile($event,upload)"
        :loading="loading"
        :disabled="!planId"
      />
    </v-flex>
    <v-flex xs12 sm6 class="text-body-2">
      Import d'un fichier Excel (.xlsx) contenant les lignes du plan sélectionné.
      <br />Le fichier Excel doit contenir les colonnes avec les intitulés :
      <ul>
        <li>« name » l'intitulé complet de la ligne de plan</li>
        <li>« value » le montant de l'engagement régional</li>
      </ul>Des colonnes optionnelles peuvent être ajoutées :
      <ul>
        <li>« descript » pour la description</li>
        <li>« total_value » pour le montant total financé</li>
        <li>le code du bénéficiaire pour préciser son financement</li>
      </ul>
    </v-flex>
  </v-layout>
</template>

<script>
import { excelUploadFile } from '@/components/Utils/excelExport'
import checkFile from './checkFile'
import * as types from '@/store/mutation-types'
import { mapState } from 'vuex'
export default {
  name: 'PlanLineUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false,
      planId: null
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = ['name', 'value']
      const save = object => {
        this.$store.dispatch(types.UPLOAD_PLAN_LINE,
          { PlanLine: object, id: this.planId })
      }
      this.loading = true
      await excelUploadFile(file, expectedHeaders, save, this.fileError)
      this.loading = false
    }
  },
  computed: {
    ...mapState({
      plans: state => state.plans.plans
    })
  },
  created () {
    this.$store.dispatch(types.GET_PLANS)
  }
}
</script>
