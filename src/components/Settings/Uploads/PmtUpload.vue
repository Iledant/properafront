<template>
  <v-layout row wrap>
    <v-flex xs12 sm6>
      <v-file-input label="Télécharger" @change="checkFile($event,upload)" :loading="loading" />
    </v-flex>
    <v-flex xs12 sm6 class="text-body-2">
      Import d'un fichier Excel (.xlsx) contenant les mandatements. Met à jour
      et complète les mandatements de Propera à partir des données IRIS.
      Utiliser uniquement le tableau de bord «Propera import
      mandats» d'IRIS qui a le bon format.
    </v-flex>
  </v-layout>
</template>

<script>
import { excelUploadFile } from '@/components/Utils/excelExport'
import checkFile from './checkFile'
import * as types from '@/store/mutation-types'
export default {
  name: 'PmtUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = [
        'coriolis_year',
        'coriolis_egt_code',
        'coriolis_egt_num',
        'coriolis_egt_line',
        'date',
        'number',
        'value',
        'cancelled_value',
        'beneficiary_code'
      ]
      const parse = p =>
        p.map(o => ({
          beneficiary_code: o.beneficiary_code,
          cancelled_value: o.cancelled_value,
          coriolis_egt_code: String(o.coriolis_egt_code),
          coriolis_egt_line: String(o.coriolis_egt_line),
          coriolis_egt_num: String(o.coriolis_egt_num),
          coriolis_year: String(o.coriolis_year),
          date: o.date,
          number: String(o.number),
          value: o.value,
          receipt_date: o.receipt_date
        }))
      const save = object => {
        this.$store.dispatch(types.ADD_PAYMENTS, { Payment: object })
      }
      this.loading = true
      await excelUploadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>
