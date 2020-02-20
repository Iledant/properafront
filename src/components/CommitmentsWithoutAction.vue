<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout wrap>
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
          >
            <template v-slot:item="{ item }">
              <tr>
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
export default {
  name: 'CommitmentsWithoutAction',
  data () {
    return {
      search: '',
      headers: [
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
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    items () {
      return this.$store.state.consistency.commitmentsWithoutAction.map(i => ({
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
