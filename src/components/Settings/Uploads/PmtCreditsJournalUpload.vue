<template>
  <v-layout row wrap>
    <v-flex xs12 sm6>
      <v-file-input label="Télécharger" @change="checkFile($event,upload)" :loading="loading" />
    </v-flex>
    <v-flex xs12 sm6 class="text-body-2">
      Import d'un fichier Excel (.xlsx) contenant la liste des mouvements
      d'enveloppes de CP importés depuis CORIOLIS. Utiliser uniquement l'export
      issu de SQL developer.
    </v-flex>
  </v-layout>
</template>

<script>
import { excelUploadFile } from '@/components/Utils/excelExport'
import checkFile from './checkFile'
import * as types from '@/store/mutation-types'
export default {
  name: 'PmtCreditsJournalUpload',
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
        'CreationDate',
        'ModificationDate',
        'Name',
        'Value'
      ]
      const parse = p =>
        p.filter(o => Number(o.Chapter) === 907 ||
          Number(o.Chapter) === 908 ||
          (Number(o.Chapter) === 905 && Number(o.Function) === 52)).map(o => ({
          Chapter: Number(o.Chapter),
          Function: Number(o.Function),
          CreationDate: parseInt(o.CreationDate),
          ModificationDate: parseInt(o.ModificationDate),
          Name: o.Name,
          Value: parseInt(100 * o.Value)
        }))
      const save = object => {
        this.$store.dispatch(types.UPLOAD_PAYMENT_CREDITS_JOURNAL,
          { PaymentCreditJournal: object })
      }
      this.loading = true
      await excelUploadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>
