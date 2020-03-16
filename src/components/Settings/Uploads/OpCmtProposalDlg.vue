<template>
  <v-dialog :value="value" max-width="1000px" persistent>
    <v-card>
      <v-card-title class="primary white--text">Rattachements engagement/opérations</v-card-title>
      <v-container grid-list-md fluid>
        <v-layout row>
          <v-flex xs12 class="caption">
            Cette boite de dialogue permet de rattacher les engagements importés
            aux opérations de Propera. Elle rapproche le nom de l'opération Propera
            de celui figurant dans IRIS. Seul les engagements cochés dans le tableau
            ci-dessous seront rattachés. Le rattachement manuel reste possible pour
            les engagements non traités.
          </v-flex>
          <v-flex xs12>
            <v-data-table
              :headers="headers"
              :items="cmtOpProposals"
              item-key="commitment_id"
              class="elevation-1"
              show-select
              v-model="selected"
              dense
              no-data-text="Aucun rattachement trouvé"
            >
              <template #item.op_name="{ item }">[{{ item.op_number }}] {{ item.op_name }}</template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn small text @click="$emit('input', false)">Annuler</v-btn>
        <v-btn small text @click="confirm">Rattacher</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'OpCmtProposalDlg',
  props: {
    value: { type: Boolean, default: false }
  },
  data () {
    return {
      selected: [],
      headers: [
        { text: 'Fiche IRIS', value: 'commitment_name' },
        { text: 'Op. IRIS', value: 'iris_op_name' },
        { text: 'Op. Propera', value: 'op_name' }
      ]
    }
  },
  computed: {
    ...mapState({
      cmtOpProposals: state => state.uploads.cmtOpProposals
    })
  },
  methods: {
    confirm () {
      const cmtOpProposals = this.selected.map(c =>
        ({ op_id: c.op_id, commitment_id: c.commitment_id }))
      this.$emit('confirm', cmtOpProposals)
      this.$emit('input', false)
    }
  }
}
</script>
