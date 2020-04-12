<template>
  <v-card>
    <v-card-title class="secondary title">
      Délais de paiement
    </v-card-title>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-menu
            :close-on-content-click="false"
            v-model="menu"
            transition="scale-transition"
            offset-y
            :nudge-right="40"
            max-width="290px"
            min-width="290px"
          >
            <template #activator="{ on }">
              <v-text-field
                v-on="on"
                label="À partir du"
                v-model="formattedDate"
                prepend-icon="event"
                readonly
              />
            </template>
            <v-date-picker
              v-model="date"
              no-title
              color="primary"
              @input="menu = false"
            />
          </v-menu>
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <payment-delay-chart />
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn color="primary" text @click="download">Export Excel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { excelExport } from '@/components/Utils/excelExport'
import { dateFilter } from '@/filters/filters'
import PaymentDelayChart from './PaymentDelays/PaymentDelayChart.js'
import * as types from '@/store/mutation-types'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'PaymentDelays',
  components: { PaymentDelayChart },
  data () {
    return {
      date: null,
      menu: false,
      headers: [
        { text: 'Moins de', value: 'delay' },
        { text: 'Nombre', value: 'number' }
      ]
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      paymentDelays: state => state.paymentDelays.paymentDelays
    }),
    formattedDate () {
      return dateFilter(this.date)
    }
  },
  methods: {
    download () {
      if (this.paymentDelays.length === 0) return
      const columns = [
        { header: 'Moins de (jours)', key: 'delay', width: 10 },
        { header: 'Nombre de paiements', key: 'number', width: 14 }
      ]
      excelExport(this.paymentDelays, columns, 'Délais de paiement')
    }
  },
  watch: {
    date (d) {
      this.$store.dispatch(types.GET_PAYMENT_DELAYS,
        { after: new Date(d).valueOf() })
    }
  }
}
</script>
