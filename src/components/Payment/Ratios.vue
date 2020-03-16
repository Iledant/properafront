<template>
  <v-card>
    <v-card-text>
      <v-container grid-list-md class="pa-0">
        <v-layout row wrap align-center>
          <v-flex class="xs12 subtitle-1">Chroniques enregistrées</v-flex>
          <v-flex xs12 sm6 offset-sm3 class="mb-2">
            <v-text-field
              prepend-icon="search"
              label="Recherche"
              single-line
              hide-details
              v-model="typeSearch"
            />
          </v-flex>
          <v-flex sm3 />
          <v-flex xs12>
            <v-data-table
              :headers="typeHeaders"
              :items="paymentTypes"
              class="elevation-1"
              :loading="loading"
              dense
              :search="typeSearch"
              no-data-text="Aucune ligne à afficher"
              no-results-text="Recherche infructueuse"
            >
              <template #item="{ item }">
                <tr>
                  <td class="px-0">
                    <v-tooltip right v-if="isAdmin">
                      <template #activator="{ on }">
                        <v-btn
                          text
                          icon
                          small
                          @click="onTypeModify(item)"
                          class="ma-0"
                          v-on="on"
                          color="secondary"
                        >
                          <v-icon>edit</v-icon>
                        </v-btn>
                      </template>
                      <span>Modifier</span>
                    </v-tooltip>
                  </td>
                  <td class="pl-0 pr-0">
                    <v-tooltip right v-if="isAdmin">
                      <template #activator="{ on }">
                        <v-btn
                          text
                          icon
                          small
                          @click="onTypeDelete(item)"
                          class="ma-0"
                          v-on="on"
                          color="error"
                        >
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </template>
                      <span>Supprimer</span>
                    </v-tooltip>
                  </td>
                  <td>{{ item.name }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
          <v-flex class="text-right" v-if="isAdmin">
            <v-btn color="primary" text @click="onTypeAdd">Ajouter</v-btn>
          </v-flex>

          <v-flex xs12 class="mr-2 subtitle-1">Calcul de chroniques</v-flex>
          <v-flex xs12 sm6 offset-sm3>
            <v-text-field
              label="Année"
              single-line
              hide-details
              v-debounce:500ms="onCalculate"
              prepend-icon="calendar_today"
              :rules="[yearRule]"
            />
          </v-flex>
          <v-flex sm3 />
          <v-flex xs12>
            <v-data-table
              :headers="yearRatioHeaders"
              :items="yearPaymentRatios"
              dense
              class="elevation-1"
              :loading="loading"
              no-data-text="Aucune ligne à afficher"
            >
              <template #item="{ item }">
                <tr>
                  <td class="text-right">{{ item.index }}</td>
                  <td class="text-right">{{ item.ratio | percentage }}</td>
                </tr>
              </template>
              <template #body.append="">
                <tr class="grey lighten-4 font-weight-medium">
                  <td class="text-center">Total</td>
                  <td class="text-right">
                    {{ yearPaymentRatioListTotal | percentage }}
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
          <v-flex xs12 class="text-right" v-if="isAdmin">
            <v-btn color="primary" text @click="onYearRatiosAdd">Enregistrer</v-btn>
          </v-flex>

          <v-flex xs12 class="mr-2 subtitle-1">Détail de la chronique</v-flex>
          <v-flex xs12 sm6 offset-sm3>
            <v-select
              :items="paymentTypes"
              v-model="typeId"
              label="Chronique enregistrée"
              single-line
              item-text="name"
              item-value="id"
              prepend-icon="calendar_today"
            />
          </v-flex>
          <v-flex sm3 />
          <v-flex xs12>
            <v-data-table
              :headers="ratioHeaders"
              :items="paymentRatios"
              class="elevation-1"
              :loading="loading"
              dense
              no-data-text="Aucune ligne à afficher"
            >
              <template #item="{ item }">
                <tr>
                  <td class="text-center">
                    <v-tooltip right v-if="isAdmin">
                      <template #activator="{ on }">
                        <v-btn
                          text
                          icon
                          small
                          class="ma-0"
                          @click="onModifyRatio(item)"
                          v-on="on"
                          color="secondary"
                        >
                          <v-icon>edit</v-icon>
                        </v-btn>
                      </template>
                      <span>Modifier</span>
                    </v-tooltip>
                  </td>
                  <td class="text-right">{{ item.index }}</td>
                  <td class="text-right">{{ item.ratio | percentage }}</td>
                </tr>
              </template>
              <template #body.append="">
                <tr class=" grey lighten-4 font-weight-medium">
                  <td colspan="2" class="text-center">Total</td>
                  <td class="text-right">
                    {{ paymentRatioListTotal | percentage }}
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
          <v-flex xs12 class="text-right" v-if="isAdmin">
            <v-btn
              color="primary"
              text
              @click="onPaymentRatioAdd"
              :disabled="paymentRatioListAddDisabled"
            >Ajouter</v-btn>
            <v-btn
              color="primary"
              text
              @click="onPaymentRatioCancel"
              :disabled="!paymentRatioListModified"
            >Annuler</v-btn>
            <v-btn
              color="primary"
              text
              @click="onPaymentRatioSave"
              :disabled="!paymentRatioListModified"
            >Sauvegarder</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>

    <v-dialog v-model="showModifyDlg" max-width="600px" persistent>
      <v-card>
        <v-card-title class="secondary">{{ modifyDlgTitle }}</v-card-title>
        <v-container grid-list-md fluid>
          <v-text-field label="Nom" v-model="modifiedTypeName" />
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="showModifyDlg = false">Annuler</v-btn>
          <v-btn
            color="primary"
            text
            @click="onDlgModify"
            :disabled="modifyDlgDisabled"
          >
            {{ modifyDlgConfirm }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showCreateYearRatiosDlg" max-width="600px">
      <v-card>
        <v-card-title class="secondary">
          Nouvelle chronique tirées des ratios
        </v-card-title>
        <v-container grid-list-md fluid>
          <v-text-field label="Nom" v-model="yearRatiosName" />
        </v-container>
        <v-card-actions class="tertiary">
          <v-spacer />
          <v-btn color="primary" text @click="showCreateYearRatiosDlg = false">
            Annuler
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="onYearRatiosCreate"
            :disabled="yearRatiosDisabled"
          >
            Créer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDeletedDlg" max-width="600px">
      <v-card>
        <v-card-title class="error white--text">Supprimer la chronique ?</v-card-title>
        <v-card-text>Supprimer la chronique {{ deletedTypeName }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="showDeletedDlg = false">Annuler</v-btn>
          <v-btn color="primary" text @click="onDlgDelete">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showModifyRatioDlg" max-width="600px" persistent>
      <v-card>
        <v-card-title class="secondary">Modification du ratio</v-card-title>
        <v-container grid-list-md fluid>
          <v-text-field v-model="modifiedRatio" label="Ratio" suffix="%" />
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="showModifyRatioDlg = false">Annuler</v-btn>
          <v-btn
            color="primary"
            text
            @click="onRatioDlgModify"
            :disabled="modifiedRatioDisabled"
          >Modifier</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import * as types from '@/store/mutation-types.js'
import yearRule from '@/components/Mixins/yearRule'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'Ratios',
  mixins: [yearRule],
  data: () => ({
    ratioHeaders: [
      { text: '', value: '', sortable: false, width: '1%' },
      { text: 'Année AP +', value: 'index', align: 'right' },
      { text: 'Ratio CP/AP', value: 'ratio', align: 'right' }
    ],
    yearRatioHeaders: [
      { text: 'Index', value: 'index', align: 'right' },
      { text: 'Ratio', value: 'ratio', align: 'right' }
    ],
    ratioItems: [],
    typeHeaders: [
      { text: '', value: '', sortable: false, width: '1%' },
      { text: '', value: '', sortable: false, width: '1%' },
      { text: 'Nom de la chronique', value: 'name' }
    ],
    typeItems: [],
    typeSearch: '',
    commitmentYear: null,
    showModifyDlg: false,
    modifyDlgTitle: 'Modifier le nom de la chronique',
    modifyDlgConfirm: 'Modifier',
    modifiedTypeName: null,
    modifiedTypeId: null,
    deletedTypeName: null,
    deletedTypeId: null,
    showDeletedDlg: false,
    typeId: null,
    showCreateYearRatiosDlg: false,
    yearRatiosName: null,
    modifiedRatio: null,
    modifiedRatioId: null,
    showModifyRatioDlg: false,
    paymentRatioListModified: false
  }),
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      isAdmin: state => state.token.isAdmin,
      paymentTypes: state => state.paymentRatios.paymentTypes,
      paymentRatios: state => state.paymentRatios.paymentRatios,
      yearPaymentRatios: state => state.paymentRatios.yearPaymentRatios
    }),
    modifyDlgDisabled () {
      return !this.modifiedTypeName
    },
    yearRatiosDisabled () {
      return !this.yearRatiosName
    },
    commitmentYearDisabled () {
      return !this.commitmentYear || !/[12][0-9]{3}/.test(this.commitmentYear)
    },
    paymentRatioListAddDisabled () {
      return !this.paymentRatios || !this.typeId
    },
    paymentRatioListTotal () {
      return this.paymentRatios.reduce((acc, cur) => acc + cur.ratio, 0)
    },
    yearPaymentRatioListTotal () {
      return this.yearPaymentRatios.reduce((acc, cur) => acc + cur.ratio, 0)
    },
    modifiedRatioDisabled () {
      return !this.modifiedRatio || !/0?.[0-9]+/.test(this.modifiedRatio)
    }
  },
  methods: {
    onCalculate (y) {
      this.commitmentYear = y
      if (!this.commitmentYearDisabled) {
        this.$store.dispatch(types.GET_YEAR_PAYMENT_RATIOS,
          { Year: parseInt(this.commitmentYear) })
      }
    },
    onTypeModify (item) {
      this.modifiedTypeName = item.name
      this.modifiedTypeId = item.id
      this.modifyDlgTitle = 'Modifier le nom de la chronique'
      this.modifyDlgConfirm = 'Modifier'
      this.showModifyDlg = true
    },
    onTypeAdd () {
      this.$store.commit(types.NEW_NEGATIVE_ID)
      this.modifiedTypeName = null
      this.modifiedTypeId = this.$store.state.ids.negativeId
      this.modifyDlgTitle = 'Nouvelle chronique nommée'
      this.modifyDlgConfirm = 'Créer'
      this.showModifyDlg = true
    },
    onDlgModify () {
      if (this.modifiedTypeName) {
        this.showModifyDlg = false
        if (this.modifyDlgConfirm === 'Modifier') {
          this.$store.dispatch(types.UPDATE_PAYMENT_TYPE, {
            id: this.modifiedTypeId,
            name: this.modifiedTypeName
          })
        } else {
          this.$store.dispatch(types.ADD_PAYMENT_TYPE, {
            name: this.modifiedTypeName
          })
        }
      }
    },
    onTypeDelete (item) {
      this.deletedTypeName = item.name
      this.deletedTypeId = item.id
      this.showDeletedDlg = true
    },
    onDlgDelete () {
      this.showDeletedDlg = false
      this.$store.dispatch(types.DELETE_PAYMENT_TYPE, { id: this.deletedTypeId })
    },
    onPaymentRatioAdd () {
      if (!this.paymentRatioListAddDisabled) {
        const last =
          this.paymentRatios.length > 0
            ? this.paymentRatios[this.paymentRatios.length - 1].index
            : -1
        this.$store.commit(types.NEW_NEGATIVE_ID)
        const newNegativeId = this.$store.state.ids.negativeId
        this.paymentRatios.push({
          id: newNegativeId,
          index: last + 1,
          payment_types_id: this.typeId,
          ratio: 0
        })
        this.paymentRatioListModified = true
      }
    },
    onYearRatiosAdd () {
      if (this.yearPaymentRatios) {
        this.yearRatiosName = null
        this.showCreateYearRatiosDlg = true
      }
    },
    onYearRatiosCreate () {
      if (this.yearRatiosName) {
        this.$store.dispatch(types.ADD_YEAR_RATIOS,
          { name: this.yearRatiosName, ratios: this.yearPaymentRatios })
        this.showCreateYearRatiosDlg = false
      }
    },
    onModifyRatio (item) {
      this.modifiedRatio = item.ratio * 100
      this.modifiedRatioId = item.id
      this.showModifyRatioDlg = true
    },
    onRatioDlgModify () {
      if (!this.modifiedRatioDisabled) {
        const ratio = parseFloat(this.modifiedRatio)
        const modifiedItem = this.paymentRatios.find(
          r => r.id === this.modifiedRatioId
        )
        modifiedItem.ratio = ratio / 100
        this.showModifyRatioDlg = false
        this.paymentRatioListModified = true
      }
    },
    onPaymentRatioCancel () {
      this.$store.dispatch(types.GET_PAYMENT_RATIOS, { id: this.typeId })
      this.paymentRatioListModified = false
    },
    onPaymentRatioSave () {
      this.$store.dispatch(types.SET_PAYMENT_RATIOS, this.paymentRatios)
      this.paymentRatioListModified = false
    }
  },
  watch: {
    typeId (newId) {
      this.$store.dispatch(types.GET_PAYMENT_RATIOS, { id: newId })
    }
  }
}
</script>
