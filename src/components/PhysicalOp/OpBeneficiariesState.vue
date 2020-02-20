<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            prepend-icon="search"
            label="Recherche"
            single-line
            hide-details
            v-model="bSearch"
          />
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="bHeaders"
            :items="bItems"
            :loading="loading"
            dense
            no-data-text="Aucun bénéficiaire"
            no-results-text="Aucun résultat trouvé"
            :search="bSearch"
            class="elevation-1"
          >
            <template v-slot:item="{item}">
              <tr>
                <td>{{ item.beneficiary }}</td>
                <td class="text-right">{{ item.commitment | valueFilter }}</td>
                <td class="text-right">{{ item.payment | valueFilter }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn text small color="primary" @click="onBeneficiaryDownload">Export Excel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { excelExport } from '../Utils/excelExport'

export default {
  name: 'OpBeneficiariesState',
  props: { op: Object },
  data: () => ({
    bSearch: '',
    bHeaders: [
      {
        text: 'Bénéficiaire',
        value: 'beneficiary',
        align: 'center',
        sortable: true
      },
      {
        text: 'Engagement',
        value: 'commitment',
        align: 'center',
        sortable: true
      },
      {
        text: 'Mandatement',
        value: 'payment',
        align: 'center',
        sortable: true
      }
    ]
  }),
  computed: {
    fcPerBeneficiary () {
      return this.$store.state.previsions.fcPerBeneficiary
    },
    loading () {
      return this.$store.getters.loading
    },
    paymentPerBeneficiary () {
      return this.$store.state.previsions.paymentPerBeneficiary
    },
    bItems () {
      const fcList = this.fcPerBeneficiary || []
      const pList = this.paymentPerBeneficiary
      return fcList.map(f => {
        const p = pList.find(o => o.beneficiary === f.beneficiary)
        return {
          beneficiary: f.beneficiary,
          commitment: f.value,
          payment: p ? p.value : 0
        }
      })
    }
  },
  methods: {
    onBeneficiaryDownload () {
      const lines = this.bItems.map(o => ({
        beneficiary: o.beneficiary,
        commitment: o.commitment ? 0.01 * o.commitment : 0,
        payment: o.payment ? 0.01 * o.payment : 0
      }))
      const columns = [
        { header: 'Bénéficiaire', key: 'beneficiary', width: 50 },
        {
          header: 'Engagements',
          key: 'commitment',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        },
        {
          header: 'Mandatements',
          key: 'payment',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        }
      ]
      excelExport(
        lines,
        columns,
        this.op.number + ' situation par bénéficiaire'
      )
    }
  }
}
</script>
