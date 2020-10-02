<template>
  <v-container grid-list-sm fluid class="pa-0">
    <v-layout row wrap>
      <v-flex xs12 md6>
        <v-card>
          <v-card-title class="secondary">
            {{ welcomeHeading }}
            <v-spacer v-if="isAdmin" />
            <v-tooltip left color="primary">
              <template #activator="{ on }" class="primary">
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
              class="text-body-2"
              v-show="todayMessage"
              v-html="todayMessage ? todayMessage.html : ''"
            />
          </v-container>
          <today-message-dlg v-model="dlg" :TodayMessage="msg" @save="save" />
        </v-card>
      </v-flex>
      <v-flex xs12 md6>
        <v-card>
          <v-card-title class="secondary">Événements prévus d'ici un mois</v-card-title>
          <v-data-table
            :loading="loading"
            :headers="headers"
            :items="events"
            dense
            no-data-text="Aucun événement trouvé d'ici un mois"
          >
            <template #item="{ item }">
              <tr>
                <td class="text-no-wrap">{{ item.date | shortDateFilter }}</td>
                <td>{{ item.operation }}</td>
                <td>{{ item.event }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
      <v-flex xs12 md6>
        <v-card>
          <v-card-title class="secondary">Consommation de crédits de paiement</v-card-title>
          <v-flex xs12>
            <payment-chart :height="400" class="mt-2" />
          </v-flex>
          <v-flex
            xs12
            class="text-right caption"
          >Date d'import : {{ paymentImportDate | dateFilter }}</v-flex>
        </v-card>
      </v-flex>
      <v-flex xs12 md6>
        <v-card>
          <v-card-title class="secondary">Engagement des AP</v-card-title>
          <v-flex xs12>
            <commitment-chart :height="400" class="mt-2" />
          </v-flex>
          <v-flex
            xs12
            class="text-right caption"
          >Date d'import : {{ commitmentImportDate | dateFilter }}</v-flex>
        </v-card>
      </v-flex>
      <v-flex xs4>
        <trend-card
          :figure="csfFigure"
          icon="receipt"
          :trend="csfTrend"
          caption="Stock de  CSF"
          :inverse="true"
        />
      </v-flex>
      <v-flex xs4>
        <trend-card
          :figure="delayFigure"
          :trend="delayTrend"
          icon="update"
          caption="Délai moyen de mandatement"
          :inverse="true"
          :digits="1"
          unit=" j"
        />
      </v-flex>
      <v-flex xs4>
        <trend-card
          :figure="paymentRateFigure"
          :trend="paymentRateTrend"
          icon="show_chart"
          caption="Taux d'exécution des CP disponibles"
          unit=" %"
        />
      </v-flex>
      <v-flex xs12 class="text-right">
        <v-btn @click="flowStockExport()" color="primary" text>Export délais</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import isAdmin from '@/components/Mixins/isAdmin'
import isObserver from '@/components/Mixins/isObserver'
import * as types from '@/store/mutation-types'
import TodayMessageDlg from './Home/TodayMessageDlg.vue'
import PaymentChart from './Home/PaymentChart.js'
import CommitmentChart from './Home/CommitmentChart.js'
// import AvgPmtTimeChart from './Home/AvgPmtTimeChart.js'
// import PaymentDemandsStockChart from './Home/PaymentDemandsStockChart.js'
import TrendCard from '@/components/Home/TrendCard.vue'
import { mapGetters, mapState } from 'vuex'
import { excelExport } from './Utils/excelExport.js'

const formatter = s => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(s)

export default {
  name: 'home',
  mixins: [isAdmin, isObserver],
  components: { TodayMessageDlg, PaymentChart, CommitmentChart, TrendCard },
  data: () => ({
    headers: [
      { text: 'Date', value: 'date', align: 'right' },
      { text: 'Opération', value: 'operation' },
      { text: 'Événement', value: 'event' }
    ],
    dlg: false,
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
      commitmentImportDate: s => s.importLog.commitmentLastDate,
      csfWeekTrend: s => s.previsions.csfWeekTrend,
      flowStockDelays: s => s.previsions.flowStockDelays,
      paymentRate: s => s.previsions.paymentRate
    }),
    csfFigure () {
      return this.csfWeekTrend ? this.csfWeekTrend.ThisWeekCount : 0
    },
    csfTrend () {
      return this.csfWeekTrend ? this.csfWeekTrend.ThisWeekCount - this.csfWeekTrend.LastWeekCount : 0
    },
    delayFigure () {
      if (!this.flowStockDelays) {
        return 0
      }
      const fsd = this.flowStockDelays
      const delay = (fsd.ActualStockCount * fsd.ActualStockAverageDelay +
        fsd.ActualFlowCount * fsd.ActualFlowAverageDelay) / (fsd.ActualStockCount + fsd.ActualFlowCount)
      return delay
    },
    paymentRateFigure () {
      return this.paymentRate ? this.paymentRate.ActualRate * 100 : 0
    },
    paymentRateTrend () {
      return this.paymentRate ? (this.paymentRate.ActualRate - this.paymentRate.PastRate) * 100 : 0
    },
    delayTrend () {
      if (!this.flowStockDelays) {
        return 0
      }
      const fsd = this.flowStockDelays
      const formerDelay = (fsd.FormerStockCount * fsd.FormerStockAverageDelay +
        fsd.FormerFlowCount * fsd.FormerFlowAverageDelay) / (fsd.FormerStockCount + fsd.FormerFlowCount)
      return this.delayFigure - formerDelay
    },
    formattedDelayTrend () {
      return this.delayTrend ? formatter(this.delayTrend) : '-'
    }
  },
  methods: {
    onTodayMessageChange () {
      this.msg = { ...this.todayMessage }
      this.dlg = true
    },
    save () {
      this.$store.dispatch(types.SET_TODAY_MESSAGE, this.msg)
    },
    flowStockExport () {
      const fsd = this.flowStockDelays
      const lines = [{
        flowAverageDelay: fsd.ActualFlowAverageDelay,
        flowCount: fsd.ActualFlowCount,
        stockAverageDelay: fsd.ActualStockAverageDelay,
        stockCount: fsd.ActualStockCount
      }]
      const columns = [
        { header: 'Flux durée (j)', key: 'flowAverageDelay', width: 20 },
        { header: 'Flux nombre', key: 'flowCount', width: 20 },
        { header: 'Stock durée (j)', key: 'stockAverageDelay', width: 20 },
        { header: 'Stock nombre', key: 'stockCount', width: 20 }
      ]
      excelExport(lines, columns, 'Flux Stock')
    }
  },
  created () {
    if (this.user) {
      this.$store.dispatch(types.GET_HOME_DATAS)
    }
  }
}
</script>
