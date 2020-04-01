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
      Import d'un fichier Excel (.xlsx) contenant les engagements
      financiers (AP). Met à jour ou complète les engagements (AP) de Propera.
      Utiliser uniquement le tableau de bord « Propera import AP » d'IRIS qui
      a le bon format.
    </v-flex>
    <op-cmt-proposal-dlg v-model="dlg" @confirm="setOpCmtLinks" />
  </v-layout>
</template>

<script>
import OpCmtProposalDlg from './OpCmtProposalDlg.vue'
import { mapState } from 'vuex'
import { excelUploadFile } from '@/components/Utils/excelExport'
import checkFile from './checkFile'
import * as types from '@/store/mutation-types'
export default {
  name: 'CmtUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false,
      dlg: false
    }
  },
  components: { OpCmtProposalDlg },
  methods: {
    async upload (file) {
      const expectedHeaders = [
        'chapter',
        'action',
        'iris_code',
        'coriolis_year',
        'coriolis_egt_code',
        'coriolis_egt_num',
        'coriolis_egt_line',
        'name',
        'beneficiary',
        'beneficiary_code',
        'date',
        'value',
        'app'
      ]
      const save = object => {
        this.$store.dispatch(types.ADD_FINANCIAL_COMMITMENTS,
          { FinancialCommitment: object })
      }
      const parse = f =>
        f.map(o => ({
          chapter: String(o.chapter),
          action: String(o.action),
          iris_code: String(o.iris_code),
          coriolis_year: String(o.coriolis_year),
          coriolis_egt_code: String(o.coriolis_egt_code),
          coriolis_egt_num: String(o.coriolis_egt_num),
          coriolis_egt_line: String(o.coriolis_egt_line),
          name: String(o.name),
          op_name: String(o.op_name),
          beneficiary: String(o.beneficiary),
          beneficiary_code: o.beneficiary_code,
          date: o.date,
          value: o.value,
          lapse_date: o.lapse_date,
          app: o.app ? (o.app === 'OUI') : false
        }))
      this.loading = true
      await excelUploadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    },
    setOpCmtLinks (list) {
      this.$store.dispatch(types.SET_OP_CMT_LINKS, list)
    }
  },
  computed: {
    ...mapState({
      cmtOpProposals: state => state.uploads.cmtOpProposals
    })
  },
  watch: {
    cmtOpProposals (list) {
      if (list.length > 0) {
        this.dlg = true
      }
    }
  }
}
</script>
