<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app v-if="user">
      <v-list nav dense class="py-0">
        <v-list-item dense link :to="{name: 'Home'}" data-cy="homeMenuItem">
          <v-list-item-icon>
            <v-icon>home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Accueil</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item
          v-for="item in parseItems"
          :key="item.id"
          :to="item.routerLink"
          link
          :data-cy="item.dataCy"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group v-model="summariesExp" prepend-icon="dashboard" data-cy="summariesMenuItem">
          <template v-slot:activator>
            <v-list-item-title>Synthèses</v-list-item-title>
          </template>
          <v-list-item
            v-for="item in summariesItems"
            :key="item.id"
            :to="item.routerLink"
            :data-cy="item.dataCy"
          >
            <v-list-item-title v-text="item.title" />
          </v-list-item>
        </v-list-group>
        <v-list-group
          v-model="settingsExp"
          prepend-icon="settings"
          v-if="isAdmin"
          data-cy="settingsMenuItem"
        >
          <template v-slot:activator>
            <v-list-item-title>Administration</v-list-item-title>
          </template>
          <v-list-item
            v-for="item in settingsItems"
            :key="item.id"
            :to="item.routerLink"
            :data-cy="item.dataCy"
          >
            <v-list-item-title v-text="item.title" />
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-snackbar bottom color="error" v-model="showErrorMsg">{{ errorMsg }}</v-snackbar>
    <v-app-bar app color="primary" dark v-if="user">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" data-cy="appMenu" />
      <v-toolbar-title>
        Propera
        <span
          class="caption"
        >{{ appVersion }}, {{ user ? user.name : '' }} {{ isAdmin ? '[adm]' : '' }}</span>
      </v-toolbar-title>
      <v-spacer />
      <v-menu bottom left>
        <template v-slot:activator="{ on }">
          <v-btn dark icon v-on="on">
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item @click="handleLogout">
            <v-list-item-title>Déconnexion</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'Password' }">
            <v-list-item-title>Changer de mot de passe</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-content v-if="user">
      <v-container fluid>
        <v-layout align-center wrap>
          <v-flex xs12>
            <router-view />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <sign-in v-model="showSignIn" />
  </v-app>
</template>

<script>
import * as types from './store/mutation-types.js'
import SignIn from './components/SignIn.vue'
import isAdmin from './components/Mixins/isAdmin'
export default {
  name: 'App',
  components: { SignIn },
  mixins: [isAdmin],
  data: () => ({
    drawer: false,
    showErrorMsg: false,
    summariesExp: false,
    settingsExp: false,
    showSignIn: false,
    appVersion: process.env.VUE_APP_VERSION
  }),
  computed: {
    user () {
      return this.$store.state.token.user
    },
    loading () {
      return this.$store.getters.loading
    },
    parseItems () {
      return this.$store.getters.parsedMenuItems
    },
    errorMsg () {
      return this.$store.state.loading.errorMsg
    },
    summariesItems () {
      return this.$store.state.token.summariesMenuItems
    },
    settingsItems () {
      return this.$store.state.token.settingsMenuItems
    }
  },
  methods: {
    async handleLogout () {
      await this.$store.dispatch(types.LOG_OUT)
    }
  },
  created () {
    this.$store.commit(types.RETRIEVE_TOKEN_FROM_LOCAL_STORAGE)
    if (!this.user) {
      this.showSignIn = true
    }
  },
  watch: {
    errorMsg (msg) {
      if (msg) this.showErrorMsg = true
    },
    user () {
      this.showSignIn = !this.user
    }
  }
}
</script>

<style>
.table-link {
  text-decoration-line: none;
}
.table-link:hover {
  text-decoration-line: underline;
  cursor: pointer;
}
</style>
