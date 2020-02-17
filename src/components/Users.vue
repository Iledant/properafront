<template>
  <v-card>
    <v-card-title class="secondary title">Gestion des utilisateurs</v-card-title>
    <v-container grid-list-md fluid>
      <v-layout wrap>
        <v-flex class="xs12 sm6 offset-sm3">
          <v-text-field
            append-icon="search"
            label="Recherche"
            single-line
            hide-details
            v-model="userSearch"
            data-cy="userSearch"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="items"
            class="elevation-1"
            :loading="loading"
            :search="userSearch"
            dense
            no-data-text="Aucun utilisateur"
            no-results-text="Recherche infructueuse"
          >
            <template v-slot:item="{item}">
              <tr>
                <td class="px-0">
                  <v-tooltip right>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        @click.stop="onModifyClick(item.id)"
                        text
                        icon
                        small
                        color="secondary"
                        class="pa-0"
                        v-on="on"
                        data-cy="userModify"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </template>
                    <span>Modifier</span>
                  </v-tooltip>
                </td>
                <td class="px-0">
                  <v-tooltip right>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        @click.stop="onRemoveClick(item.id)"
                        icon
                        text
                        small
                        color="error"
                        class="pa-0"
                        v-on="on"
                      >
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Supprimer</span>
                  </v-tooltip>
                </td>
                <td class="text-left">
                  <router-link
                    :to="{
                    name: 'Rights',
                    params: { user_id: item.id, user_name: item.name }
                  }"
                    class="table-link"
                  >{{ item.email }}</router-link>
                </td>
                <td class="text-left">{{ item.name }}</td>
                <td class="text-center">{{ item.role }}</td>
                <td class="text-center">{{ item.active | yesNoFilter }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn color="primary" text @click.stop="onAddClick" data-cy="userAdd">Ajouter</v-btn>
    </v-card-actions>
    <user-edit-dlg v-model="showDialog" :user="user" :mentions="mentions" @save="onSave($event)" />
    <deleted-dlg
      v-model="removeDlg"
      cat="l'utilisateur"
      :name="deletingUser.name"
      @confirm="onConfirmRmv"
    />
  </v-card>
</template>

<script>
import * as types from '../store/mutation-types.js'
import UserEditDlg from './Users/UserEditDlg.vue'
import DeletedDlg from './DeleteDlg.vue'
export default {
  name: 'users',
  components: { UserEditDlg, DeletedDlg },
  data: () => ({
    headers: [
      { text: '', value: '', align: 'center', sortable: false, width: '1%' },
      { text: '', value: '', align: 'center', sortable: false, width: '1%' },
      { text: 'Login', value: 'email', align: 'center' },
      { text: 'Nom complet', value: 'name', align: 'center' },
      { text: 'Rôle', value: 'role', align: 'center' },
      { text: 'Compte actif', value: 'active', align: 'center' }
    ],
    userRole: {
      USER: 'Utilisateur',
      ADMIN: 'Administrateur',
      OBSERVER: 'Observateur'
    },
    showDialog: false,
    user: {
      id: null,
      name: '',
      email: '',
      password: '',
      role: 'USER',
      active: false
    },
    mentions: { title: 'Nouvel utilisateur', validate: 'Créer' },
    removeDlg: false,
    deletingUser: {
      id: null,
      name: '',
      email: '',
      password: '',
      role: 'USER',
      active: false
    },
    userSearch: '',
    showErrorMsg: false
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    users () {
      return this.$store.state.users.userList
    },
    items () {
      return this.users.map(u => ({ ...u, role: this.userRole[u.role] }))
    }
  },
  methods: {
    onAddClick () {
      this.$store.commit(types.NEW_NEGATIVE_ID)
      this.user = {
        id: this.$store.state.ids.negativeId,
        name: '',
        email: '',
        password: '',
        role: 'USER',
        active: false
      }
      this.mentions = { title: 'Nouvel utilisateur', validate: 'Créer' }
      this.showDialog = true
    },
    onModifyClick (id) {
      const u = this.users.find(p => p.id === id)
      this.user = {
        id: u.id,
        name: u.name,
        email: u.email,
        password: '',
        role: u.role,
        active: u.active
      }
      this.mentions = {
        title: 'Modifier les données de l\'utilisateur',
        validate: 'Modifier'
      }
      this.showDialog = true
    },
    onSave () {
      if (this.mentions.validate === 'Créer') {
        this.$store.dispatch(types.ADD_USER, { user: this.user })
      } else this.$store.dispatch(types.UPDATE_USER, { user: this.user })
      this.showDialog = false
    },
    onRemoveClick (id) {
      this.deletingUser = this.users.find(p => p.id === id)
      this.removeDlg = true
    },
    onConfirmRmv () {
      const index = this.items.findIndex(i => i.id === this.deletingUser.id)
      this.items.splice(index, 1)
      this.$store.dispatch(types.DEL_USER, { user: this.deletingUser })
      this.removeDlg = false
    }
  },
  created () {
    this.$store.dispatch(types.GET_USERS, { role: '' })
  }
}
</script>
