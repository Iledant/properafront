<template>
  <v-card>
    <v-card-title class="secondary title">
      Gestion de la structure budgétaire
    </v-card-title>
    <v-container fluid class="pa-0">
      <v-tabs
        v-model="tab"
        background-color="secondary"
        slider-color="primary"
        centered
      >
        <v-tab>Chapitre</v-tab>
        <v-tab-item><chapters /> </v-tab-item>
        <v-tab>Secteur</v-tab>
        <v-tab-item><sectors /></v-tab-item>
        <v-tab>Programmes</v-tab>
        <v-tab-item><programs /></v-tab-item>
        <v-tab>Actions</v-tab>
        <v-tab-item><actions /></v-tab-item>
      </v-tabs>
    </v-container>
  </v-card>
</template>

<script>
import * as types from '@/store/mutation-types'
import Chapters from './Budget/Chapters'
import Sectors from './Budget/Sectors'
import Programs from './Budget/Programs'
import Actions from './Budget/Actions'
export default {
  name: 'Budget',
  components: { Chapters, Sectors, Programs, Actions },
  data () {
    return { tab: null }
  },
  created () {
    this.$store.dispatch(types.GET_BUDGET_TABLES)
  }
}
</script>
