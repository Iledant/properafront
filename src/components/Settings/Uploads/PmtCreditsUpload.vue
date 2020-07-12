<template>
  <v-layout row wrap>
    <v-flex xs12 sm6>
      <v-file-input label="Télécharger" @change="checkFile($event,upload)" :loading="loading" />
    </v-flex>
    <v-flex xs12 sm6 class="text-body-2">
      Import d'un fichier Excel (.xlsx) contenant la situation des enveloppes de
      CP importés depuis CORIOLIS. Utiliser uniquement l'export issu de SQL
      developer.
    </v-flex>
  </v-layout>
</template>

<script>
import { excelUploadFile } from '@/components/Utils/excelExport'
import checkFile from './checkFile'
import * as types from '@/store/mutation-types'
export default {
  name: 'PmtCreditsUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = [
        'Chapter',
        'Function',
        'Primitive',
        'Reported',
        'Added',
        'Modified',
        'Movement'
      ]
      const parse = p =>
        p.map(o => ({
          Chapter: Number(o.Chapter),
          Function: Number(o.Function),
          Primitive: parseInt(100 * o.Primitive),
          Reported: parseInt(100 * o.Reported),
          Added: parseInt(100 * o.Added),
          Modified: parseInt(100 * o.Modified),
          Movement: parseInt(100 * o.Movement)
        }))
      const save = object => {
        this.$store.dispatch(types.UPLOAD_PAYMENT_CREDITS,
          { PaymentCredit: object })
      }
      this.loading = true
      await excelUploadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>
