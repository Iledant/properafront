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
      Import d'un fichier Excel (.xlsx) contenant une liste de programmes
      budgétaires.
      <br />Le fichier Excel doit contenir les colonnes avec les intitulés :
      <ul>
        <li>« code » chiffré du programme budgétaire</li>
        <li>
          « subfunction » sous fonction de rattachement comportant 2
          ou 3 chiffres (77 ou 881)
        </li>
        <li>« name » intitulé du programme</li>
        <li>« chapter » chapitre de rattachement (907 ou 908)</li>
      </ul>
      Propera tentera d’actualiser l’intituler le nom du programme si un
      programme existe déjà avec le même code, sous fonction et chapitre. Les
      autres champs seront ajoutés à condition que le code chapitre puisse être
      trouvé dans la base de données.
    </v-flex>
  </v-layout>
</template>

<script>
import { excelUploadFile } from '@/components/Utils/excelExport'
import checkFile from './checkFile'
import * as types from '@/store/mutation-types'
export default {
  name: 'ProgramUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = ['code', 'subfunction', 'name', 'chapter']
      const save = object => {
        this.$store.dispatch(types.ADD_BUDGET_PROGRAMS,
          { BudgetProgram: object })
      }
      const parse = items => items.map(o => ({
        chapter: parseInt(o.chapter),
        name: o.name,
        code: String(o.code),
        subfunction: String(o.subfunction)
      }))
      this.loading = true
      await excelUploadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>
