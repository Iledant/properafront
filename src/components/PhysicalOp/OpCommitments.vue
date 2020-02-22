<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout row wrap class="mt-3 mb-2" align-center>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            prepend-icon="search"
            label="Recherche"
            single-line
            hide-details
            v-model="search"
          />
        </v-flex>
        <v-flex xs12 class="mt-3">
          <v-data-table
            :headers="headers"
            :items="filteredCommitments"
            :loading="loading"
            dense
            no-data-text="Aucun engagement"
            no-results-text="Aucun engagement trouvé"
            class="elevation-1"
          >
            <template #body.prepend="">
              <tr class="grey lighten-4 font-weight-medium">
                <td colspan="6" class="text-center">Total de la recherche</td>
                <td class="text-right">{{ commitmentTotal | valueFilter }}</td>
                <td class="text-right">{{ availableTotal | valueFilter }}</td>
              </tr>
            </template>
            <template #item="{item}">
              <tr>
                <td class="text-no-wrap">{{ item.date | dateFilter }}</td>
                <td class="text-no-wrap">{{ item.iris_code }}</td>
                <td class="text-no-wrap">{{ item.lapse_date | dateFilter }}</td>
                <td>{{ item.app | yesNoFilter }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.beneficiary }}</td>
                <td class="text-right text-no-wrap">{{ item.value | valueFilter }}</td>
                <td class="text-right text-no-wrap">{{ item.available | valueFilter }}</td>
              </tr>
            </template>
            <template #body.append="">
              <tr class="grey lighten-4 font-weight-medium">
                <td colspan="6" class="text-center">Total de la recherche</td>
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
      <v-btn text color="primary" @click="download">Export Excel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { excelExport, valStyle, dateStyle } from '../Utils/excelExport'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'OpCommitments',
  data: () => ({
    search: '',
    headers: [
      { text: 'Date', value: 'date' },
      { text: 'Code IRIS', value: 'iris_code' },
      { text: 'Date de caducité', value: 'lapse_date' },
      { text: 'APP', value: 'app' },
      { text: 'Nom IRIS', value: 'name' },
      { text: 'Bénéficiaire', value: 'beneficiary' },
      { text: 'Montant', value: 'value', align: 'right' },
      { text: 'Disponible', value: 'available', align: 'right' }
    ]
  }),
  props: { op: Object },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      commitments: state => state.previsions.fcList
    }),
    filteredCommitments () {
      const upSearch = this.search.toUpperCase()
      return this.commitments.filter(f => Object.values(f).some(
        v => v && v.toString().toUpperCase().includes(upSearch)))
    },
    commitmentTotal () {
      return this.filteredCommitments.reduce((a, c) => a + c.value, 0)
    },
    availableTotal () {
      return this.filteredCommitments.reduce((a, c) => a + Number(c.available), 0)
    }
  },
  methods: {
    download () {
      const lines = this.commitments.map(f => ({
        date: new Date(f.date),
        iris_code: f.iris_code,
        name: f.name,
        lapse_date: new Date(f.lapse_date),
        app: f.app ? 'oui' : 'non',
        beneficiary: f.beneficiary,
        value: f.value ? 0.01 * f.value : 0,
        available: f.available ? 0.01 * f.available : 0
      }))
      const columns = [
        { header: 'Date', key: 'date', ...dateStyle },
        { header: 'Code IRIS', key: 'iris_code', width: 10 },
        { header: 'Nom IRIS', key: 'name', width: 50 },
        { header: 'Date de caducité', key: 'lapse_date', ...dateStyle },
        { header: 'AP projet', key: 'app', width: 10 },
        { header: 'Bénéficiaire', key: 'beneficiary', width: 50 },
        { header: 'Montant', key: 'value', ...valStyle },
        { header: 'Disponible', key: 'available', ...valStyle }
      ]
      excelExport(lines, columns, this.op.number + ' liste des engagements')
    }
  }
}
</script>
