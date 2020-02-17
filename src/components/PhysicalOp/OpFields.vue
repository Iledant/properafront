<template>
  <v-layout>
    <v-flex xs12 md8 offset-md2 lg6 offset-lg3>
      <v-simple-table dense v-if="op" class="tertiary">
        <tbody>
          <tr>
            <td class="text-right">Description</td>
            <td>{{ op.descript }}</td>
          </tr>
          <tr>
            <td class="text-right">Opération ISR</td>
            <td>{{ op.isr | yesNoFilter }}</td>
          </tr>
          <tr>
            <td class="text-right">Longueur</td>
            <td>{{ op.length | lengthFilter }}</td>
          </tr>
          <tr>
            <td class="text-right">Valeur</td>
            <td>{{ op.value | valueFilter }}</td>
          </tr>
          <tr>
            <td class="text-right">Date de valeur</td>
            <td>{{ op.valuedate | dateValueFilter }}</td>
          </tr>
          <tr>
            <td class="text-right">VAN</td>
            <td>{{ op.van | valueFilter }}</td>
          </tr>
          <tr>
            <td class="text-right">TRI</td>
            <td>{{ op.tri | TRIFilter }}</td>
          </tr>
          <tr>
            <td class="text-right">Plan</td>
            <td>{{ op.plan_name || '-' }}</td>
          </tr>
          <tr>
            <td class="text-right">Ligne de plan</td>
            <td>{{ op.plan_line_name || '-' }}</td>
          </tr>
          <tr>
            <td class="text-right">Financements inscrits</td>
            <td>{{ funding }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-flex>
  </v-layout>
</template>

<script>
import { valueFilter, percentage } from '../../filters/filters.js'
export default {
  name: 'OpFields',
  props: { op: Object },
  computed: {
    funding () {
      if (!this.op.plan_line_value) return '-'
      return (
        'Région : ' +
        valueFilter(this.op.plan_line_value) +
        ' (' +
        percentage(
          this.op.plan_line_total_value
            ? this.op.plan_line_value / this.op.plan_line_total_value
            : null
        ) +
        '), total : ' +
        valueFilter(this.op.plan_line_total_value)
      )
    }
  }
}
</script>
