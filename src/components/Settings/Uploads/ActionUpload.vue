<template>
  <v-layout row wrap>
    <v-flex xs12 sm6>
      <v-file-input label="Télécharger" @change="checkFile($event,upload)" :loading="loading" />
    </v-flex>
    <v-flex xs12 sm6 class="text-body-2">
      Import d'un fichier Excel (.xlsx) contenant une liste de actions
      budgétaires.
      <br />Le fichier Excel doit contenir les colonnes avec les intitulés :
      <ul>
        <li>« code » chiffré de l'action budgétaire</li>
        <li>« sector » secteur de rattachement de l'action (MO, TMSP...)</li>
        <li>« name » intitulé du programme</li>
      </ul>Si l’action existe déjà, son intitulé avec mis à jour. Sinon, l’action est
      ajoutée à condition que le code secteur et que le code du programme
      puissent être reconnus.
    </v-flex>
  </v-layout>
</template>

<script>
import { excelUploadFile } from '@/components/Utils/excelExport'
import checkFile from './checkFile'
import * as types from '@/store/mutation-types'
export default {
  name: 'ActionUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = ['code', 'name', 'sector']
      const save = object => {
        this.$store.dispatch(types.ADD_BUDGET_ACTION, { BudgetAction: object })
      }
      const parse = b =>
        b.map(o => ({
          code: String(o.code),
          name: String(o.Code),
          sector: o.String(o.Sector)
        }))
      this.loading = true
      await excelUploadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>
