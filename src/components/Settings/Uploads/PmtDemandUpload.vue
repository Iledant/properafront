<template>
  <v-layout row wrap>
    <v-flex xs12 sm6>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="formattedDate"
            label="Date d'import"
            prepend-icon="event"
            readonly
            v-on="on"
          />
        </template>
        <v-date-picker v-model="date" no-title @input="menu = false" />
      </v-menu>
      <v-file-input
        label="Télécharger"
        @change="checkFile($event,upload)"
        :loading="loading"
        :disabled="!date"
      />
    </v-flex>
    <v-flex xs12 sm6 class="text-body-2">
      Import d'un fichier Excel (.xlsx) contenant la liste des DVS en cours de
      validation. Une date d'import est obligatoire : celle de génération du
      tableau de bord. Cette date est stockées dans la base de données de
      Propera. L'import met à jour et complète la base de données des DVS.
      Utiliser uniquement le tableau de bord «Propera liste des DVS» d'IRIS qui
      a le bon format.
    </v-flex>
  </v-layout>
</template>

<script>
import { excelUploadFile } from '@/components/Utils/excelExport'
import checkFile from './checkFile'
import * as types from '@/store/mutation-types'
export default {
  name: 'PmtDemandUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false,
      menu: false,
      date: null
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = [
        'iris_code',
        'iris_name',
        'commitment_date',
        'beneficiary_code',
        'demand_number',
        'demand_date',
        'receipt_date',
        'demand_value',
        'csf_date',
        'csf_comment',
        'demand_status',
        'status_comment'
      ]
      const parse = p =>
        p.map(o => ({
          iris_code: String(o.iris_code),
          iris_name: o.iris_name,
          commitment_date: o.commitment_date,
          beneficiary_code: parseInt(o.beneficiary_code),
          demand_number: parseInt(o.demand_number),
          demand_date: o.demand_date,
          receipt_date: o.receipt_date,
          demand_value: parseInt(100 * o.demand_value),
          csf_date: o.csf_date,
          csf_comment: o.csf_comment || null,
          demand_status: o.demand_status,
          status_comment: o.status_comment || null
        }))
      const save = o => {
        this.$store.dispatch(types.UPLOAD_PAYMENT_DEMANDS,
          { PaymentDemand: o, ImportDate: new Date(this.date) })
      }
      this.loading = true
      await excelUploadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  },
  computed: {
    formattedDate () {
      if (!this.date) {
        return '-'
      }
      return new Date(this.date).toLocaleDateString('fr-FR',
        { day: '2-digit', month: '2-digit', year: 'numeric' })
    }
  }
}
</script>
