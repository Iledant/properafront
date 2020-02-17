<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout wrap>
        <v-flex xs12 class="subtitle">
          Paiement sans liens
        </v-flex>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            append-icon="search"
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
                <td class="mx=0">
                  <v-tooltip right>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        @click="select(item)"
                        class="ma-0"
                        color="primary"
                        v-on="on"
                      >
                        <v-icon>link</v-icon>
                      </v-btn>
                    </template>
                    <span>Lier à un engagement</span>
                  </v-tooltip>
                </td>
                <td>{{ item.date | dateFilter }}</td>
                <td>{{ item.number }}</td>
                <td class="text-right">{{ item.value | valueFilter }}</td>
                <td>{{ item.commitment }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="subtitle">
          Engagements possiblement liés
        </v-flex>
        <v-flex xs12 v-show="idSelected">
          <v-data-table
            :headers="cmtsHeaders"
            :items="cmts"
            class="elevation-1"
            :loading="loading"
            :search="search"
            dense
          >
            <template v-slot:item="{ item }">
              <tr>
                <td class="mx=0">
                  <v-tooltip>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        @click="link(item)"
                        class="ma-0"
                        color="primary"
                        v-on="on"
                      >
                        <v-icon>link</v-icon>
                      </v-btn>
                    </template>
                    <span>Lier à un engagement</span>
                  </v-tooltip>
                </td>
                <td>{{ item.chapter }}</td>
                <td>{{ item.action }}</td>
                <td>{{ item.iris_code }}</td>
                <td>{{ item.commitment }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.date | dateFilter }}</td>
                <td class="text-right">{{ item.value | valueFilter }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import * as types from '../store/mutation-types'
export default {
  name: 'UnlinkedPayments',
  data () {
    return {
      search: '',
      idSelected: null,
      headers: [
        { text: '', value: '', sortable: false, width: '1%' },
        { text: 'Date', value: 'date' },
        { text: 'Numéro', value: 'number' },
        { text: 'Montant', value: 'value', align: 'right' },
        { text: 'Code engagement', value: 'commitment' }
      ],
      cmtsHeaders: [
        { text: '', value: '', sortable: false, width: '1%' },
        { text: 'Chap.', value: 'chapter' },
        { text: 'Action', value: 'action' },
        { text: 'Code IRIS', value: 'iris_code' },
        { text: 'Code eng.', value: 'commitment' },
        { text: 'Intitulé', value: 'name' },
        { text: 'Date', value: 'date' },
        { text: 'Montant', value: 'value', align: 'right' }
      ]
    }
  },
  methods: {
    async select (item) {
      this.idSelected = item.id
      await this.$store.dispatch(types.GET_POSSIBLE_CMTS, this.idSelected)
    },
    async link (item) {
      const cmtId = item.id
      await this.$store.dispatch(types.LINK_PAYMENT_CMT,
        { PaymentId: this.idSelected, CmtId: cmtId })
      this.selected = null
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    items () {
      return this.$store.state.consistency.unlinkedPayments.map(i => ({
        id: i.id,
        number: i.number,
        date: i.date,
        value: i.value,
        commitment: i.coriolis_year + ' ' + i.coriolis_egt_code + ' ' +
         i.coriolis_egt_num + ' ' + i.coriolis_egt_line
      }))
    },
    cmts () {
      return this.$store.state.consistency.possibleLinkedCmts.map(i => ({
        id: i.id,
        chapter: i.chapter,
        action: i.action,
        iris_code: i.iris_code,
        commitment: i.coriolis_year + ' ' + i.coriolis_egt_code + ' ' + i.coriolis_egt_num + ' ' + i.coriolis_egt_line,
        name: i.name,
        date: i.date,
        value: i.value
      }))
    }
  }
}
</script>
