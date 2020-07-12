<template>
  <v-card>
    <v-card-title class="secondary">Catégories et étapes d'opérations</v-card-title>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 class="text-subtitle-1">Catégories</v-flex>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            label="Recherche"
            single-line
            hide-details
            v-model="catSearch"
            prepend-icon="search"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            dense
            :loading="loading"
            :headers="catHeaders"
            :items="categories"
            :search="catSearch"
            class="elevation-1"
            no-data-text="Aucune étape trouvée"
            no-results-text="Recherche infructueuse"
          >
            <template #item="{item}">
              <tr>
                <td class="pa-0">
                  <v-tooltip right>
                    <template #activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        @click.stop="onCategoryEdit(item)"
                        class="pa-0"
                        color="secondary"
                        v-on="on"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </template>
                    <span>Modifier l'étape</span>
                  </v-tooltip>
                </td>
                <td class="pa-0">
                  <v-tooltip right>
                    <template #activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        @click.stop="onCategoryDelete(item)"
                        class="pa-0"
                        color="error"
                        v-on="on"
                      >
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Supprimer l'étape</span>
                  </v-tooltip>
                </td>
                <td>{{ item.name }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="text-right">
          <v-btn text color="primary" @click="onCategoryAdd">Créer une catégorie</v-btn>
        </v-flex>
        <v-flex xs12 class="text-subtitle-1 mt-4">Étapes</v-flex>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            label="Recherche"
            prepend-icon="search"
            single-line
            hide-details
            v-model="stepSearch"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :loading="loading"
            dense
            :headers="stepHeaders"
            :items="steps"
            :search="stepSearch"
            class="elevation-1"
            no-data-text="Aucune étape trouvée"
            no-results-text="Recherche infructueuse"
          >
            <template #item="{item}">
              <tr>
                <td class="pa-0">
                  <v-tooltip right>
                    <template #activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        @click.stop="onStepEdit(item)"
                        class="pa-0"
                        v-on="on"
                        color="secondary"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </template>
                    <span>Modifier l'étape</span>
                  </v-tooltip>
                </td>
                <td class="pa-0">
                  <v-tooltip right>
                    <template #activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        @click.stop="onStepDelete(item)"
                        class="pa-0"
                        v-on="on"
                        color="error"
                      >
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Supprimer l'étape</span>
                  </v-tooltip>
                </td>
                <td>{{ item.name }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="text-right">
          <v-btn text color="primary" @click="onStepAdd">Créer une étape</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <CategoryDlg
      :Category="modifiedCategory"
      v-model="showCategoryDlg"
      :mentions="categoryMentions"
      @save="onCategorySave"
    />
    <delete-dlg
      v-model="categoryRemoveDlg"
      cat="la catégorie"
      :name="deletedCategory.name"
      @confirm="onCategoryConfirmDelete"
    />
    <delete-dlg
      v-model="stepRemoveDlg"
      cat="l'étape"
      :name="deletedStep.name"
      @confirm="onStepConfirmDelete"
    />
    <step-dlg
      :Step="modifiedStep"
      v-model="showStepDlg"
      :mentions="stepMention"
      @save="onStepSave"
    />
  </v-card>
</template>

<script>
import * as types from '@/store/mutation-types.js'
import CategoryDlg from './StepsCategories/CategoryDlg.vue'
import StepDlg from './StepsCategories/StepDlg.vue'
import DeleteDlg from '@/components/DeleteDlg.vue'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'StepsCategories',
  components: { CategoryDlg, StepDlg, DeleteDlg },
  data: () => ({
    catSearch: '',
    catHeaders: [
      { text: '', value: '', sortable: false, width: '1%' },
      { text: '', value: '', sortable: false, width: '1%' },
      { text: 'Nom', value: 'name' }
    ],
    modifiedCategory: { id: 0, name: '' },
    categoryMentions: {
      title: 'Modifier la catégorie',
      validate: 'Modifier'
    },
    showCategoryDlg: false,
    categoryRemoveDlg: false,
    deletedCategory: { id: 0, name: '' },
    stepSearch: '',
    stepHeaders: [
      { text: '', value: '', sortable: false, width: '1%' },
      { text: '', value: '', sortable: false, width: '1%' },
      { text: 'Nom', value: 'name' }
    ],
    modifiedStep: { id: 0, name: '' },
    stepMention: { title: 'Modifier l\'étape', validate: 'Modifier' },
    showStepDlg: false,
    stepRemoveDlg: false,
    deletedStep: { id: 0, name: '' }
  }),
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      categories: state => state.stepsAndCategories.categories,
      steps: state => state.stepsAndCategories.steps
    })
  },
  methods: {
    onCategoryEdit (item) {
      this.categoryMentions = {
        title: 'Modifier la catégorie',
        validate: 'Modifier'
      }
      this.modifiedCategory = { ...item }
      this.showCategoryDlg = true
    },
    onCategoryAdd () {
      this.categoryMentions = {
        title: 'Créer une catégorie',
        validate: 'Créer'
      }
      this.modifiedCategory = { id: 0, name: '' }
      this.showCategoryDlg = true
    },
    onCategorySave () {
      const action = this.categoryMentions.validate === 'Créer'
        ? types.ADD_CATEGORY
        : types.UPDATE_CATEGORY
      this.$store.dispatch(action, { Category: this.modifiedCategory })
    },
    onCategoryDelete (item) {
      this.deletedCategory = { ...item }
      this.categoryRemoveDlg = true
    },
    onCategoryConfirmDelete () {
      this.$store.dispatch(types.DEL_CATEGORY, {
        Category: this.deletedCategory
      })
      this.categoryRemoveDlg = false
    },
    onStepEdit (item) {
      this.mentions = { title: 'Modifier l\'étape', validate: 'Modifier' }
      this.modifiedStep = { ...item }
      this.showStepDlg = true
    },
    onStepAdd () {
      this.mentions = { title: 'Créer une étape', validate: 'Créer' }
      this.modifiedStep = { id: 0, name: '' }
      this.showStepDlg = true
    },
    onStepSave () {
      const action = this.mentions.validate === 'Créer'
        ? types.ADD_STEP
        : types.UPDATE_STEP
      this.$store.dispatch(action, { Step: this.modifiedStep })
    },
    onStepDelete (item) {
      this.deletedStep = { ...item }
      this.stepRemoveDlg = true
    },
    onStepConfirmDelete () {
      this.$store.dispatch(types.DEL_STEP, { Step: this.deletedStep })
      this.stepRemoveDlg = false
    }
  },
  created () {
    this.$store.dispatch(types.GET_STEPS_AND_CATEGORIES)
  }
}
</script>
