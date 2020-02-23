<template>
  <v-card>
    <v-card-title class="secondary">
      <v-icon class="mr-2">check_circle</v-icon>
      Droits de {{ userName }}
    </v-card-title>
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 class="subtitle-1">
          <v-icon class="mr-2">work</v-icon>Droit sur les opérations
        </v-flex>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            prepend-icon="search"
            label="Recherche"
            single-line
            hide-details
            v-model="opSearch"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :headers="opHeaders"
            :items="ops"
            :search="opSearch"
            class="elevation-1"
            v-model="opSelected"
            :loading="loading"
            no-results-text="Recherche infructueuse"
            show-select
            no-data-text="Aucune opération"
            dense
          />
        </v-flex>
        <v-flex xs12 class="text-right" v-if="rightsModified">
          <v-btn text color="primary" @click="onOpCancel">Annuler</v-btn>
          <v-btn text color="primary" @click="onOpSave">Sauver</v-btn>
        </v-flex>
        <v-flex xs12 class="subtitle-1">
          <v-icon class="mr-2">person</v-icon>Copier les droits d'utilisateurs
        </v-flex>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            prepend-icon="search"
            label="Recherche"
            single-line
            hide-details
            v-model="userSearch"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :headers="userHeaders"
            :items="users"
            :search="userSearch"
            v-model="usersSelected"
            class="elevation-1"
            :loading="loading"
            no-results-text="Recherche infructueuse"
            no-data-text="Aucun utilisateur"
            show-select
            dense
          />
        </v-flex>
        <v-flex xs12 class="text-right" v-if="usersSelected.length > 0">
          <v-btn text color="primary" @click="onUserCancel">Annuler</v-btn>
          <v-btn text color="primary" @click="onUserSave">Sauver</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import * as types from '../store/mutation-types'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'rights',
  data: () => ({
    opSearch: '',
    opHeaders: [
      { text: 'Numéro', value: 'number' },
      { text: 'Nom', value: 'name' }
    ],
    opSelected: [],
    userSearch: '',
    usersSelected: [],
    userHeaders: [
      { text: 'Utilisateur', value: 'name' }
    ]
  }),
  methods: {
    onOpSave () {
      const physicalOpIdList = this.opSelected.map(i => i.id)
      this.$store.dispatch(types.SET_RIGHTS, {
        UserId: this.user_id,
        Right: physicalOpIdList
      })
    },
    onOpCancel () {
      this.fillItems(this.rights)
    },
    onUserSave () {
      this.$store.dispatch(types.INHERIT_RIGHTS, {
        UserId: this.user_id,
        Right: this.usersSelected.map(u => u.id)
      })
      this.usersSelected = []
    },
    onUserCancel () {
      this.usersSelected = []
    },
    fillItems (rightList) {
      this.opSelected = this.ops
        ? this.ops.filter(op => rightList.includes(op.id))
        : []
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      users: state => state.users.userList,
      rights: state => state.physops.rights,
      ops: state => state.physops.ops
    }),
    user_id () {
      return this.$route.params.user_id
    },
    userName () {
      return this.$route.params.user_name
    },
    rightsModified () {
      if (this.rights === null) {
        return false
      }
      if (this.rights.length !== this.opSelected.length) {
        return true
      }
      const orderedRights = this.rights.slice().sort()
      const orderedSelIDs = this.opSelected.map(op => op.id).sort()
      const len = orderedRights.length
      for (let i = 0; i < len; i++) {
        if (orderedRights[i] !== orderedSelIDs[i]) {
          return true
        }
      }
      return false
    }
  },
  created () {
    if (this.user_id) {
      this.$store.dispatch(types.GET_RIGHTS, { userId: this.user_id })
    }
  },
  watch: {
    rights (newRights) {
      this.fillItems(newRights)
    }
  }
}
</script>
