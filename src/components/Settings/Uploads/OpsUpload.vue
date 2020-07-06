<template>
  <v-layout row wrap>
    <v-flex xs12 sm6>
      <v-file-input label="Télécharger" @change="checkFile($event,upload)" :loading="loading" />
    </v-flex>
    <v-flex xs12 sm6 class="text-body-2">
      Import d'un fichier Excel (.xlsx) contenant des opérations nouvelles ou à
      mettre à jour.
      <br />La première ligne doit contenir les noms anglais des champs.
      <br />3 champs sont obligatoires :
      <ul>
        <li>« number » en minuscule, le numéro de l’opération physique</li>
        <li>« name » en minuscule, le nom de l'opération</li>
        <li>
          « isr » en minuscule, booléen, pour savoir si l'opération
          éligible aux emprunts ISR
        </li>
      </ul>Les autres champs sont facultatifs :
      <ul>
        <li>« value » évaluation en euros</li>
        <li>« valuedate » date de valeur de l'évaluation</li>
        <li>« length » longueur en mètres</li>
        <li>« tri » TRI exprimé en pourcentage</li>
        <li>« van » valeur actualisée nette</li>
        <li>
          « action » code chiffré de l'action budgétaire de
          rattachement
        </li>
        <li>« payment_types_id » index de la chronique enregistrée</li>
        <li>« plan_line_id » index de la ligne de plan de rattachement</li>
      </ul>
    </v-flex>
  </v-layout>
</template>

<script>
import { excelUploadFile } from '@/components/Utils/excelExport'
import checkFile from './checkFile'
import * as types from '@/store/mutation-types'
export default {
  name: 'OpsUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = ['number', 'name', 'isr']
      const save = object => {
        this.$store.dispatch(types.ADD_PHYSICAL_OPS, { PhysicalOp: object })
      }
      const parse = p =>
        p.map(o => ({
          number: o.number,
          name: o.name,
          isr: o.isr,
          descript: o.descript || null,
          value: o.value || null,
          length: o.length || null,
          step: o.step || null,
          category: o.category || null,
          tri: o.tri || null,
          van: o.van || null,
          action: o.action ? String(o.action) : null,
          payment_types_id: o.payment_types_id || null,
          plan_line_id: o.plan_line_id || null
        }))
      this.loading = true
      await excelUploadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>
