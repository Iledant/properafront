<template>
  <v-container grid-list-md fluid>
    <v-layout wrap>
      <v-flex xs12>
        <v-select
          :items="programmingsYears"
          v-model="progYear"
          label="Année de programmation"
          single-line
          item-text="year"
          item-value="year"
          persistent-hint
        />
      </v-flex>
      <v-flex xs12 class="text-right">
        <v-btn
          color="primary"
          text
          @click="onProgYearExcelExport"
          :disabled="!progYear"
        >Export Excel</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import * as types from '@/store/mutation-types'
import { mapState } from 'vuex'
export default {
  name: 'DepartmentProg',
  data () {
    return {
      progYear: null
    }
  },
  computed: {
    ...mapState({
      programmingsYears: state => state.programmings.programmingsYears
    })
  },
  methods: {
    onProgYearExcelExport () {
      this.$store.dispatch(types.GET_DETAILED_PROGRAMMINGS_PER_DPT,
        { year: this.progYear })
    }
  }
}
</script>
