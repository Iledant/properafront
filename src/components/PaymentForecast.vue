<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout row>
        <v-flex xs12 class="title">Prévisions des bénéficiaires</v-flex>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            prepend-icon="search"
            label="Recherche"
            single-line
            hide-details
            v-model="search"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="items"
            class="elevation-1"
            :loading="loading"
            :search="search"
            dense
          >
            <template v-slot:item="{ item }">
              <tr>
                <td class="pr-0 pl-0">
                  <v-tooltip right v-if="isAdmin">
                    <template #activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        @click.stop="edit(item)"
                        class="ma-0"
                        v-on="on"
                        color="secondary"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </template>
                    <span>Modifier l'élément</span>
                  </v-tooltip>
                </td>
                <td class="pr-0 pl-0">
                  <v-tooltip right v-if="isAdmin">
                    <template #activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        @click.stop="remove(item)"
                        class="ma-0"
                        v-on="on"
                        color="error"
                      >
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Supprimer l'élément</span>
                  </v-tooltip>
                </td>
                <td>{{ item.BeneficiaryName }}</td>
                <td>{{ item.Date | dateFilter }}</td>
                <td class="text-right">{{ item.Value | valueFilter }}</td>
                <td>
                  <v-tooltip color="primary" left>
                    <template v-slot:activator="{ on }">
                      <div v-on="on">{{ item.Comment | truncate }}</div>
                    </template>
                    <span>{{ item.Comment }}</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="text-right">
          <v-btn color="primary" text @click="add">Ajouter</v-btn>
        </v-flex>
        <v-flex xs12 class="title">Synthèse des prévisions</v-flex>
        <v-flex xs12 sm6>
          <v-autocomplete
            :items="paymentTypes"
            v-model="pmtTypeID"
            label="Chronique pour la prévision"
            item-value="id"
            item-text="name"
            no-data-text="Pas de chronique disponible"
          />
        </v-flex>
        <v-flex xs12 sm6>
          <v-text-field
            v-model="year"
            label="Année de prévision"
            :rules="[yearRule]"
            prepend-icon="calendar_today"
          />
        </v-flex>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            v-model="summarySearch"
            label="Recherche"
            prepend-icon="search"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :headers="needHeaders"
            :items="needsAndForecasts"
            class="elevation-1"
            :loading="loading"
            :search="summarySearch"
            dense
          >
            <template #body.prepend="">
              <tr class="font-weight-medium grey lighten-4">
                <td colspan="2">Total</td>
                <td class="text-right">{{ totalNeed | valueFilter }}</td>
                <td class="text-right">{{ totalPayment | valueFilter }}</td>
                <td class="text-right">{{ totalForecast | valueFilter }}</td>
                <td />
              </tr>
            </template>
            <template #item="{ item }">
              <tr>
                <td>{{ item.BeneficiaryName }}</td>
                <td>{{ item.Date | dateFilter }}</td>
                <td class="text-right">{{ item.Need | valueFilter }}</td>
                <td class="text-right">{{ item.Payment | valueFilter }}</td>
                <td class="text-right">{{ item.Forecast | valueFilter }}</td>
                <td>
                  <v-tooltip color="primary" left>
                    <template v-slot:activator="{ on }">
                      <div v-on="on">{{ item.Comment | truncate }}</div>
                    </template>
                    <span>{{ item.Comment }}</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
            <template v-slot:body.append="">
              <tr class="font-weight-medium grey lighten-4">
                <td colspan="2">Total</td>
                <td class="text-right">{{ totalNeed | valueFilter }}</td>
                <td class="text-right">{{ totalPayment | valueFilter }}</td>
                <td class="text-right">{{ totalForecast | valueFilter }}</td>
                <td />
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="text-right">
          <v-btn color="primary" text :disabled="disabled" @click="download">
            Export Excel
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>

    <payment-need-dlg
      :PaymentNeed="modifiedItem"
      v-model="dlg"
      :action="action"
      @save="save"
    />

    <delete-dlg
      v-model="delDlg"
      cat="la prévision"
      :name="delName"
      @confirm="confirmDelete"
    />
  </v-card>
</template>

<script>
import * as types from '../store/mutation-types.js'
import isAdmin from './Mixins/isAdmin'
import DeleteDlg from './DeleteDlg.vue'
import PaymentNeedDlg from './Payment/PaymentNeedDlg.vue'
import yearRule from './Mixins/yearRule'
import { excelExport, valStyle, dateStyle } from './Utils/excelExport.js'
import { mapGetters, mapState } from 'vuex'

const nullItem = {
  ID: 0,
  BeneficiaryID: null,
  BeneficiaryName: null,
  Date: null,
  Name: null,
  Comment: null
}
export default {
  name: 'PaymentForecast',
  components: { DeleteDlg, PaymentNeedDlg },
  mixins: [isAdmin, yearRule],
  data () {
    return {
      search: '',
      needHeaders: [
        { text: 'Bénéficiaire', value: 'BeneficiaryName' },
        { text: 'Date', value: 'Date' },
        { text: 'Prévision', value: 'Need', align: 'right' },
        { text: 'Paiement', value: 'Payment', align: 'right' },
        { text: 'Statistique', value: 'Forecast', align: 'right' },
        { text: 'Commentaire', value: 'Comment' }
      ],
      headers: [
        { text: '', value: '', sortable: false, width: '1%' },
        { text: '', value: '', sortable: false, width: '1%' },
        { text: 'Bénéficiaire', value: 'BeneficiaryName' },
        { text: 'Date', value: 'Date' },
        { text: 'Montant', value: 'Value', align: 'right' },
        { text: 'Commentaire', value: 'Comment' }
      ],
      modifiedItem: { ...nullItem },
      action: 'create',
      dlg: false,
      delDlg: false,
      delName: '',
      pmtTypeID: null,
      summarySearch: '',
      year: new Date().getFullYear().toString()
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      items: state => state.previsions.paymentNeeds,
      paymentTypes: state => state.paymentRatios.paymentTypes,
      needsAndForecasts: state => state.previsions.needsAndForecasts
    }),
    totalNeed () {
      return this.needsAndForecasts.reduce((a, c) => a + c.Need, 0)
    },
    totalPayment () {
      return this.needsAndForecasts.reduce((a, c) => a + c.Payment, 0)
    },
    totalForecast () {
      return this.needsAndForecasts.reduce((a, c) => a + c.Forecast, 0)
    },
    disabled () {
      return this.needsAndForecasts.length === 0
    }
  },
  methods: {
    edit (item) {
      this.modifiedItem = { ...item }
      this.action = 'modify'
      this.dlg = true
    },
    add () {
      this.modifiedItem = { ...nullItem }
      this.action = 'create'
      this.dlg = true
    },
    save () {
      const action = this.action === 'create'
        ? types.CREATE_PAYMENT_NEED
        : types.UPDATE_PAYMENT_NEED
      this.$store.dispatch(action, { PaymentNeed: this.modifiedItem })
    },
    remove (item) {
      this.modifiedItem = { ...item }
      this.delName = `${item.BeneficiaryName} du ` +
        new Date(item.Date).toISOString().substr(0, 10)
      this.delDlg = true
    },
    confirmDelete () {
      this.$store.dispatch(types.DELETE_PAYMENT_NEED, this.modifiedItem.ID)
    },
    checkYear (y) {
      return /^20\d{2}$/.test(y)
    },
    getNeedsAndForecast () {
      if (this.pmtTypeID !== null && this.checkYear(this.year)) {
        this.$store.dispatch(types.GET_PAYMENT_NEEDS_AND_FORECAST,
          { Year: this.year, PaymentTypeID: this.pmtTypeID })
      }
    },
    download () {
      const lines = this.needsAndForecasts.map(l => ({
        BeneficiaryName: l.BeneficiaryName,
        Date: new Date(l.Date),
        Need: l.Need ? 0.01 * l.Need : 0,
        Payment: l.Payment ? 0.01 * l.Payment : 0,
        Forecast: l.Forecast ? 0.01 * l.Forecast : 0,
        Comment: l.Comment
      }))
      const columns = [
        { header: 'Bénéficiaire', key: 'BeneficiaryName', width: 30 },
        { header: 'Date', key: 'Date', ...dateStyle },
        { header: 'Prévision', key: 'Need', ...valStyle },
        { header: 'Paiement', key: 'Payment', ...valStyle },
        { header: 'Statistique', key: 'Forecast', ...valStyle },
        { header: 'Commentaire', key: 'Comment', width: 50 }
      ]
      excelExport(lines, columns, 'Prévision de bénéficiaire')
    }
  },
  watch: {
    year () {
      this.getNeedsAndForecast()
    },
    pmtTypeID () {
      this.getNeedsAndForecast()
    }
  }
}
</script>
