<template>
  <v-layout row wrap>
    <v-flex xs12 sm6>
      <v-file-input
        label="Télécharger"
        @change="checkFile($event,upload)"
        :loading="loading"
      />
    </v-flex>
    <v-flex xs12 sm6 class="body-2">
      Import d'un fichier Excel (.xlsx) contenant les besoins d'engagement.
      Met à jour et complète les prévisions d'engagement.  Pour une opération
      donnée, la prévision d'une année du fichier remplace celle de la base de
      données.
      <br />La première ligne du fichier doit contenir les noms anglais des
      champs.
      <br />L'entête doit contenir « number » en minuscule, le numéro de
      l’opération physique et les années de prévision à insérer ou modifier.
    </v-flex>
  </v-layout>
</template>

<script>
import { excelUploadFile } from '@/components/Utils/excelExport'
import checkFile from './checkFile'
import * as types from '@/store/mutation-types'
export default {
  name: 'CmtPrevUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = ['number', 'year', 'value']
      const save = object => {
        this.$store.dispatch(types.UPLOAD_PREVCOMMITMENTS, {
          PrevCommitment: object
        })
      }
      const parse = a => {
        const r = []
        for (const i of a) {
          const parsed = {
            number: i.number,
            year: i.year,
            value: parseInt(100 * i.value)
          }
          if ('total_value' in i) {
            parsed.total_value = parseInt(100 * i.total_value)
          }
          if ('state_ratio' in i) parsed.state_ratio = i.state_ratio
          r.push(parsed)
        }
        return r
      }
      this.loading = true
      await excelUploadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>
