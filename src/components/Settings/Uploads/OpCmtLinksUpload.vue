<template>
  <v-layout row wrap>
    <v-flex xs12 sm6>
      <v-file-input label="Télécharger" @change="checkFile($event,upload)" :loading="loading" />
    </v-flex>
    <v-flex xs12 sm6 class="text-body-2">
      Import d'un fichier Excel (.xlsx) permettant de rattacher des engagements
      aux opérations physiques.
      <br />Le fichier Excel doit contenir les colonnes avec les intitulés :
      <ul>
        <li>« op_number » qui correspond au numéro d’opération physique</li>
        <li>« coriolis_year »</li>
        <li>« coriolis_egt_code »</li>
        <li>« coriolis_egt_num »</li>
        <li>« coriolis_egt_line »</li>
      </ul>Ces 4 derniers champs décrivent de manière unique l’engagement dans
      coriolis. Ils apparaissent dans l’export Excel du tableau de bord d’IRIS.
      Les données sont directement intégrées par requête dans Propera. Si une
      erreur est faite dans un des champs, la ligne n’est pas prise en compte.
    </v-flex>
  </v-layout>
</template>

<script>
import { excelUploadFile } from '@/components/Utils/excelExport'
import checkFile from './checkFile'
import * as types from '@/store/mutation-types'
export default {
  name: 'OpCmtLinksUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = [
        'op_number',
        'coriolis_year',
        'coriolis_egt_code',
        'coriolis_egt_num',
        'coriolis_egt_line'
      ]
      const save = object => {
        this.$store.dispatch(types.ADD_ATTACHMENTS, { Attachment: object })
      }
      const parse = o =>
        o.map(o => ({
          op_number: String(o.op_number),
          coriolis_year: String(o.coriolis_year),
          coriolis_egt_code: String(o.coriolis_egt_code),
          coriolis_egt_num: String(o.coriolis_egt_num),
          coriolis_egt_line: String(o.coriolis_egt_line)
        }))
      this.loading = true
      await excelUploadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>
