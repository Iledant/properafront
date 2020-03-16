<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout row wrap align-center>
        <v-flex xs6 sm3 offset-sm3>
          <v-text-field
            label="Première année"
            v-debounce:500ms="handleFirstYear"
            prepend-icon="calendar_today"
            :rules="[yearRule]"
          />
        </v-flex>
        <v-flex xs6 sm3>
          <v-text-field
            label="Dernière année"
            v-debounce:500ms="handleLastYear"
            prepend-icon="calendar_today"
            :rules="[yearRule, lastYearRule]"
          />
        </v-flex>
        <v-flex xs12 sm6>
          <v-data-table
            :loading="loading"
            :headers="fcPerDptHeaders"
            :items="fcPerDptItems"
            class="elevation-1"
            no-data-text="Pas de synthèse"
            hide-default-footer
          >
            <template #item="{ item }">
              <tr>
                <td>{{ item.place }}</td>
                <td class="text-right">{{ item.value | valueFilter }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 sm6>
          <fc-per-dpt-chart :height="400" />
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions v-if="!disabled" class="tertiary">
      <v-spacer />
      <v-btn color="primary" text @click="download" v-if="!disabled">
        Détail Excel
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import FcPerDptChart from './FcPerDptChart.js'
import * as types from '../../store/mutation-types'
import yearRule from '../Mixins/yearRule'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'DepartmentCommitments',
  components: { FcPerDptChart },
  mixins: [yearRule],
  data () {
    return {
      firstYear: null,
      lastYear: null,
      fcPerDptHeaders: [
        { text: 'Lieu', value: 'place' },
        { text: 'Engagements', value: 'value', align: 'right' }
      ],
      fcPerDptItems: []
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      fcPerDpt: state => state.dptRatios.commitmentsPerDpt
    }),
    disabled () {
      return (
        !this.checkYear(this.firstYear) ||
        !this.checkYear(this.lastYear) ||
        this.lastYear < this.firstYear
      )
    }
  },
  methods: {
    handleFirstYear (y) {
      this.firstYear = y
      this.getFcPerDpt()
    },
    handleLastYear (y) {
      this.lastYear = y
      this.getFcPerDpt()
    },
    checkYear (y) {
      return /^20\d{2}$/.test(y)
    },
    lastYearRule (y) {
      return (this.checkYear(this.firstYear) && this.checkYear(y) &&
        parseInt(y) >= parseInt(this.firstYear)) ||
        'Doit être supérieure à la première'
    },
    getFcPerDpt () {
      if (!this.disabled) {
        this.$store.dispatch(types.GET_COMMITMENTS_PER_DPT,
          { firstYear: this.firstYear, lastYear: this.lastYear })
      }
    },
    download () {
      this.$store.dispatch(types.GET_DETAILED_COMMITMENTS_PER_DPT,
        { firstYear: this.firstYear, lastYear: this.lastYear })
    }
  },
  watch: {
    fcPerDpt (list) {
      this.fcPerDptItems = []
      if (list) {
        const item = list[0]
        for (const k in item) {
          if (k === 'total') this.fcPerDptItems.push({ place: 'Tous', value: item[k] })
          else this.fcPerDptItems.push({ place: k[2] + k[3], value: item[k] })
        }
      }
    }
  }
}
</script>
