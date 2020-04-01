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
      Import d'un fichier Excel (.xlsx) contenant les engagements d'une
      prochaine commission. Remplace les engagements en cours de Propera à
      partir des données IRIS. Utiliser uniquement le tableau de bord
      «Propera import AP en cours» d'IRIS qui a le bon format.
    </v-flex>
  </v-layout>
</template>

<script>
import { excelUploadFile } from '@/components/Utils/excelExport'
import checkFile from './checkFile'
import * as types from '@/store/mutation-types'
export default {
  name: 'PendingCmtUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = [
        'chapter',
        'action',
        'iris_code',
        'name',
        'beneficiary',
        'commission_date',
        'proposed_value'
      ]
      const save = object => {
        this.$store.dispatch(types.ADD_PENDINGS, { PendingCommitment: object })
      }
      const parse = p =>
        p.map(o => ({
          chapter: String(o.chapter),
          action: String(o.action),
          iris_code: String(o.iris_code),
          name: String(o.name),
          beneficiary: String(o.beneficiary),
          commission_date: o.commission_date,
          proposed_value: o.proposed_value
        }))
      this.loading = true
      await excelUploadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>
