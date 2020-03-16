<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field prepend-icon="search" label="Recherche" v-model="search" />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :loading="loading"
            :headers="headers"
            :items="items"
            :search="search"
            class="elevation-1"
            dense
          >
            <template #item="{ item }">
              <tr>
                <td
                  :class="isObserver ? '': 'table-link primary--text'"
                  @click="edit(item)"
                >
                  <span class="font-weight-bold">[{{ item.number }}]</span>
                  {{ item.name }}
                </td>
                <td class="text-right text-no-wrap">
                  {{ item.r75 | percentage }}
                </td>
                <td class="text-right text-no-wrap">
                  {{ item.r77 | percentage }}
                </td>
                <td class="text-right text-no-wrap">
                  {{ item.r78 | percentage }}
                </td>
                <td class="text-right text-no-wrap">
                  {{ item.r91 | percentage }}
                </td>
                <td class="text-right text-no-wrap">
                  {{ item.r92 | percentage }}
                </td>
                <td class="text-right text-no-wrap">
                  {{ item.r93 | percentage }}
                </td>
                <td class="text-right text-no-wrap">
                  {{ item.r94 | percentage }}
                </td>
                <td class="text-right text-no-wrap">
                  {{ item.r95 | percentage }}
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-btn color="primary" text @click="download">Export Excel</v-btn>
      <v-spacer v-if="!isObserver" />
      <v-btn
        color="primary"
        text @click="onCancel"
        v-if="modified && !isObserver"
      >
        Annuler
      </v-btn>
      <v-btn
        color="primary"
        text @click="onSend"
        v-if="modified && !isObserver"
      >
        Valider
      </v-btn>
    </v-card-actions>
    <department-ratio-dlg v-model="dialog" :ratios="ratios" @modify="modify" />
  </v-card>
</template>

<script>
import DepartmentRatioDlg from './DepartmentRatioDlg.vue'
import { excelExport, percentStyle } from '../Utils/excelExport'
import * as types from '@/store/mutation-types'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'DepartmentRatios',
  components: { DepartmentRatioDlg },
  data () {
    return {
      items: [],
      ratios: {},
      search: '',
      headers: [
        { text: 'Opération', value: 'fullName' },
        { text: '75', value: 'r75' },
        { text: '77', value: 'r77' },
        { text: '78', value: 'r78' },
        { text: '91', value: 'r91' },
        { text: '92', value: 'r92' },
        { text: '93', value: 'r93' },
        { text: '94', value: 'r94' },
        { text: '95', value: 'r95' }
      ],
      modified: false,
      dialog: false
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      operations: state => state.dptRatios.opsWithDptRatios,
      isObserver: state => state.token.isObserver
    })
  },
  methods: {
    onCancel () {
      this.$store.dispatch(types.GET_OPS_WITH_DPT_RATIOS)
      this.modified = false
    },
    edit (item) {
      if (!this.isObserver) {
        this.ratios = { ...item }
        this.dialog = true
      }
    },
    modify () {
      const index = this.items.findIndex(i => i.id === this.ratios.id)
      this.items.splice(index, 1, this.ratios)
      this.modified = true
    },
    onSend () {
      const sent = []
      this.items.forEach(i => {
        if (!i.r75) {
          sent.push({
            physical_op_id: i.id,
            r75: Number(i.r75),
            r77: Number(i.r77),
            r78: Number(i.r78),
            r91: Number(i.r91),
            r92: Number(i.r92),
            r93: Number(i.r93),
            r94: Number(i.r94),
            r95: Number(i.r95)
          })
        }
      })
      this.$store.dispatch(types.SET_OPERATIONS_DPT_RATIOS, {
        OpDptRatios: sent
      })
      this.modified = false
    },
    download () {
      const lines = this.operations.map(l => ({
        number: l.number,
        name: l.name,
        r75: l.r75 ? Number(l.r75) : null,
        r77: l.r77 ? Number(l.r77) : null,
        r78: l.r78 ? Number(l.r78) : null,
        r91: l.r91 ? Number(l.r91) : null,
        r92: l.r92 ? Number(l.r92) : null,
        r93: l.r93 ? Number(l.r93) : null,
        r94: l.r94 ? Number(l.r94) : null,
        r95: l.r95 ? Number(l.r95) : null
      }))
      const columns = [
        { header: 'Numéro', key: 'number', width: 8 },
        { header: 'Nom de l\'opération', key: 'name', width: 50 },
        { header: 'Paris', key: 'r75', ...percentStyle },
        { header: 'Seine-et-Marne', key: 'r77', ...percentStyle },
        { header: 'Yvelines', key: 'r78', ...percentStyle },
        { header: 'Essonne', key: 'r91', ...percentStyle },
        { header: 'Hauts-de-Seine', key: 'r92', ...percentStyle },
        { header: 'Seine-Saint-Denis', key: 'r93', ...percentStyle },
        { header: 'Val-de-Marne', key: 'r94', ...percentStyle },
        { header: 'Val d\'Oise', key: 'r95', ...percentStyle }
      ]
      excelExport(lines, columns, 'Ratios opération départements')
    }
  },
  watch: {
    operations: {
      handler (newOpList) {
        this.items = newOpList.map(i =>
          ({ fullName: `${i.number} - ${i.name}`, ...i }))
      },
      immediate: true
    }
  }
}
</script>
