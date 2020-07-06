<template>
  <v-layout row wrap>
    <v-flex xs12 sm6>
      <v-file-input label="Télécharger" @change="checkFile($event,upload)" :loading="loading" />
    </v-flex>
    <v-flex xs12 sm6 class="text-body-2">
      Import d'un fichier Excel (.xlsx) contenant l'export IRIS
      « PROPERA - budget ».
      <br />Le fichier Excel doit contenir les colonnes avec les intitulés :
      <ul>
        <li>« commission_date » date de calcul des disponibilités</li>
        <li>« chapter » chapitre des AP concernées (905, 907, 908)</li>
        <li>« primary_commitment » montant du budget initial</li>
        <li>« frozen_commitment » montant du gel</li>
        <li>« reserved_commitment » montant de la mise en réserve</li>
      </ul>Seuls les éléments nouveaux sont ajoutés à la base de données.
    </v-flex>
  </v-layout>
</template>

<script>
import { excelUploadFile } from '@/components/Utils/excelExport'
import checkFile from './checkFile'
import * as types from '@/store/mutation-types'
export default {
  name: 'CreditsUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = [
        'commission_date',
        'chapter',
        'primary_commitment',
        'frozen_commitment',
        'reserved_commitment'
      ]
      const save = object => {
        this.$store.dispatch(types.ADD_BUDGET_CREDITS, { BudgetCredits: object })
      }
      const parse = p =>
        p.map(({ chapter, ...others }) =>
          ({ chapter: Number(chapter), ...others })
        )
      this.loading = true
      await excelUploadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>
