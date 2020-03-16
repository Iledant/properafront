<template>
  <v-card>
    <v-card-title class="secondary">Analyse par départements</v-card-title>
    <v-container fluid class="pa-0">
      <v-tabs
        v-model="tab"
        background-color="secondary"
        slider-color="primary"
        centered
      >
        <v-tab>Engagements</v-tab>
        <v-tab-item><department-commitments /></v-tab-item>
        <v-tab>Programmation</v-tab>
        <v-tab-item><department-prog /></v-tab-item>
        <v-tab>Ratios</v-tab>
        <v-tab-item><department-ratios /></v-tab-item>
      </v-tabs>
    </v-container>
  </v-card>
</template>
<script>
import * as types from '@/store/mutation-types.js'
import DepartmentRatios from './Departments/DepartmentRatios.vue'
import DepartmentCommitments from './Departments/DepartmentCommitments.vue'
import DepartmentProg from './Departments/DepartmentProg.vue'

export default {
  name: 'Departments',
  components: { DepartmentCommitments, DepartmentRatios, DepartmentProg },
  data () {
    return {
      tab: null
    }
  },
  created () {
    this.$store.dispatch(types.GET_OPS_WITH_DPT_RATIOS)
  }
}
</script>
