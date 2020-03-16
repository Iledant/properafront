<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 sm6>
          <v-autocomplete
            :items="beneficiariesList"
            v-model="beneficiaryId"
            label="Bénéficiaire"
            item-text="name"
            item-value="id"
            no-data-text="Aucune bénéficiaire trouvé"
          />
        </v-flex>
        <v-flex xs12 sm6>
          <v-text-field
            prepend-icon="search"
            label="Recherche"
            single-line
            hide-details
            v-model="search"
          />
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="commitments"
            :loading="loading"
            dense
            no-data-text="Aucun engagement"
            no-results-text="Aucun engagement trouvé"
            :search="search"
            class="elevation-1"
          >
            <template #body.prepend="">
              <tr class="grey lighten-4 font-weight-medium">
                <td colspan="6" class="text-center">Total</td>
                <td class="text-right">{{ commitmentTotal | valueFilter }}</td>
                <td class="text-right">{{ availableTotal | valueFilter }}</td>
              </tr>
            </template>
            <template #item="{item}">
              <tr>
                <td class="text-center text-no-wrap">{{ item.date | dateFilter }}</td>
                <td class="text-no-wrap">{{ item.irisCode }}</td>
                <td class="text-center text-no-wrap">
                  {{ item.lapseDate | dateFilter }}
                </td>
                <td>{{ item.app | yesNoFilter }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.operation }}</td>
                <td class="text-right text-no-wrap">
                  {{ item.value | valueFilter }}
                </td>
                <td class="text-right text-no-wrap">
                  {{ item.available | valueFilter }}
                </td>
              </tr>
            </template>
            <template #body.append="">
              <tr class="grey lighten-4 font-weight-medium">
                <td colspan="6" class="text-center">Total</td>
                <td class="text-right">{{ commitmentTotal | valueFilter }}</td>
                <td class="text-right">{{ availableTotal | valueFilter }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn
        text
        color="primary"
        :disabled="commitments.length === 0"
        @click="onExcelExport"
      >Export Excel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { excelExport, valStyle, dateStyle } from '../Utils/excelExport.js'
import * as types from '@/store/mutation-types'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'CommitmentPerBeneficiary',
  data: () => ({
    beneficiaryId: null,
    search: '',
    headers: [
      { text: 'Date', value: 'date' },
      { text: 'Code IRIS', value: 'irisCode' },
      { text: 'Date de caducité', value: 'lapseDate' },
      { text: 'APP', vale: 'app' },
      { text: 'Nom IRIS', value: 'name' },
      { text: 'Opération', value: 'operation' },
      { text: 'Montant', value: 'value', align: 'right' },
      { text: 'Disponible', value: 'available', align: 'right' }
    ]
  }),
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      beneficiariesList: state => state.beneficiaries.beneficiaries,
      commitments: state => state.beneficiaries.beneficiaryCmt.map(
        ({ opNumber, opName, ...others }) =>
          ({
            operation: (opNumber || '') + '-' + (opName || ''),
            opName,
            opNumber,
            ...others
          }))
    }),
    commitmentTotal () {
      return this.commitments.reduce((a, c) => a + c.value, 0)
    },
    availableTotal () {
      return this.commitments.reduce((a, c) => a + c.available, 0)
    }
  },
  methods: {
    onExcelExport () {
      const lines = this.commitments.map(f => ({
        date: new Date(f.date),
        irisCode: f.irisCode,
        name: f.name,
        lapseDate: new Date(f.lapseDate),
        app: f.app ? 'oui' : 'non',
        value: f.value ? 0.01 * f.value : 0,
        opNumber: f.opNumber,
        opName: f.opName,
        available: f.available ? 0.01 * f.available : 0
      }))
      const columns = [
        { header: 'Date', key: 'date', ...dateStyle },
        { header: 'Code IRIS', key: 'irisCode', width: 10 },
        { header: 'Nom IRIS', key: 'name', width: 50 },
        { header: 'Numéro', key: 'opNumber', width: 14 },
        { header: 'Opération', key: 'opName', width: 30 },
        { header: 'Date de caducité', key: 'lapseDate', ...dateStyle },
        { header: 'AP projet', key: 'app', width: 10 },
        { header: 'Montant', key: 'value', ...valStyle },
        { header: 'Disponible', key: 'available', ...valStyle }
      ]
      excelExport(lines, columns, 'Situation bénéficiaire')
    }
  },
  watch: {
    beneficiaryId () {
      if (this.beneficiaryId !== null) {
        this.$store.dispatch(types.GET_BENEFICIARY_COMMITMENT, this.beneficiaryId)
      }
    }
  }
}
</script>
