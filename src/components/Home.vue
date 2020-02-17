<template>
  <v-container grid-list-sm fluid class="pa-0">
    <v-layout row wrap>
      <v-flex xs12 md6>
        <v-card>
          <v-card-title class="secondary title">
            {{ welcomeHeading }}
            <v-spacer v-if="isAdmin"></v-spacer>
            <v-tooltip left color="primary">
              <template v-slot:activator="{ on }" class="primary">
                <v-btn
                  x-small
                  fab
                  color="primary"
                  v-if="isAdmin"
                  @click="onTodayMessageChange"
                  data-cy="homeEditTodayMsg"
                >
                  <v-icon small v-on="on">edit</v-icon>
                </v-btn>
              </template>
              <span>Changer le message</span>
            </v-tooltip>
          </v-card-title>
          <v-container grid-list-md>
            <div
              class="body-2"
              v-show="todayMessage"
              v-html="todayMessage ? todayMessage.html : ''"
            />
          </v-container>
          <today-message-dlg v-model="dlg" :TodayMessage="msg" @save="save"/>
        </v-card>
      </v-flex>
      <v-flex xs12 md6>
        <v-card>
          <v-card-title class="secondary title">Événements prévus d'ici un mois</v-card-title>
          <v-data-table
            :loading="loading"
            :headers="headers"
            :items="events"
            dense
            no-data-text="Aucun événement trouvé d'ici un mois"
          >
            <template v-slot:item="{ item: { date, operation, event } }">
              <tr>
                <td class="text-no-wrap">{{ date | dateFilter }}</td>
                <td>{{ operation }}</td>
                <td>{{ event }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
      <v-flex xs12 md6>
        <v-card>
          <v-card-title class="secondary title">
            Consommation de crédits de paiement
          </v-card-title>
          <v-flex xs12>
            <payment-chart :height="400" class="mt-2" />
          </v-flex>
          <v-flex xs12 class="text-right caption" >
            Date d'import : {{ paymentImportDate | dateFilter }}
          </v-flex>
        </v-card>
      </v-flex>
      <v-flex xs12 md6>
        <v-card>
          <v-card-title class="secondary title">Engagement des AP</v-card-title>
          <v-flex xs12>
            <commitment-chart :height="400" class="mt-2" />
          </v-flex>
          <v-flex xs12 class="text-right caption">
            Date d'import : {{ commitmentImportDate | dateFilter }}
          </v-flex>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import isAdmin from './Mixins/isAdmin'
import isObserver from './Mixins/isObserver'
import * as types from '../store/mutation-types'
import TodayMessageDlg from './Home/TodayMessageDlg.vue'
import PaymentChart from './Home/PaymentChart.js'
import CommitmentChart from './Home/CommitmentChart.js'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'home',
  mixins: [isAdmin, isObserver],
  components: { TodayMessageDlg, PaymentChart, CommitmentChart },
  data: () => ({
    headers: [
      { text: 'Date', value: 'date', align: 'center' },
      { text: 'Opération', value: 'operation', align: 'center' },
      { text: 'Événement', value: 'event', align: 'center' }
    ],
    ppmHeaders: [
      { text: 'Mois', value: 'month', align: 'center' },
      { text: 'Consommation', value: 'value', align: 'center' }
    ],
    dlg: false,
    totalPayments: 0,
    msg: { title: '', text: '' }
  }),
  computed: {
    welcomeHeading () {
      return this.user
        ? this.todayMessage
          ? this.todayMessage.title
          : ''
        : 'Non connecté'
    },
    ...mapGetters(['loading']),
    ...mapState({
      user: s => s.token.user,
      events: s => s.physops.events,
      todayMessage: s => s.messages.todayMessage,
      paymentImportDate: s => s.importLog.paymentLastDate,
      commitmentImportDate: s => s.importLog.commitmentLastDate
    })
  },
  methods: {
    onTodayMessageChange () {
      this.msg = { ...this.todayMessage }
      this.dlg = true
    },
    save () {
      this.$store.dispatch(types.SET_TODAY_MESSAGE, this.msg)
    }
  },
  created () {
    if (this.user) {
      this.$store.dispatch(types.GET_HOME_DATAS)
    }
  }
}
</script>
