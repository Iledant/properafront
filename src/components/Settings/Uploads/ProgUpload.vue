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
      Import d'un fichier Excel (.xlsx) contenant la programmation de l'année.
      Remplace la programmation de la base de données.
      <br />Le tableau doit contenir
      <ul>
        <li>« number » pour le numéro d’opération</li>
        <li>« value » pour le montant programmé au cour de l’année</li>
        <li>
          « commission_date » pour la date prévisionnelle de la
          commission permanente ou du conseil régional où sera affecté
          le montant
        </li>
      </ul>
      Une colonne « year » peut être ajoutée pour préciser l’année de la
      programmation à modifier.
    </v-flex>
  </v-layout>
</template>

<script>
import { excelUploadFile } from '@/components/Utils/excelExport'
import checkFile from './checkFile'
import * as types from '@/store/mutation-types'
export default {
  name: 'ProgUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = ['number', 'value', 'commission_date']
      const parse = parsedItems => parsedItems.map(item => {
        const r = {
          value: parseInt(100 * item.value),
          commission_date: parseInt(item.commission_date),
          number: item.number
        }
        if (Object.hasOwnProperty.call(item, 'total_value')) {
          r.total_value = parseInt(100 * item.total_value)
        }
        if (Object.hasOwnProperty.call(item, 'state_ratio')) {
          r.state_ratio = parseInt(item.state_ratio)
        }
        return r
      })
      const save = object => {
        this.$store.dispatch(types.ADD_PROGRAMMINGS, { Programmings: object })
      }
      this.loading = true
      await excelUploadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>
