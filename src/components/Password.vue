<template>
  <v-layout row wrap>
    <v-flex xs12 justify-center v-if="isLoading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-flex>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-title class="primary white--text title">Changer le mot de passe</v-card-title>
        <v-container grid-list-md fluid>
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                label="Mot de passe"
                v-model="password"
                :rules="[checkIfNotEmpty]"
                :append-icon="hideOldPassword ? 'visibility' : 'visibility_off'"
                @click:append="hideOldPassword = !hideOldPassword"
                :type="hideOldPassword ? 'password' : 'text'"
                required
                autofocus
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                label="Nouveau mot de passe"
                v-model="newPassword"
                :rules="[checkIfNotEmpty]"
                :append-icon="hideNewPassword ? 'visibility' : 'visibility_off'"
                @click:append="hideNewPassword = !hideNewPassword"
                :type="hideNewPassword ? 'password' : 'text'"
                required
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                label="Confirmer le nouveau de passe"
                v-model="confirmPassword"
                :rules="[checkIfNotEmpty, checkSimilar]"
                :append-icon="
                  hideConfirmPassword ? 'visibility' : 'visibility_off'
                "
                @click:append="hideConfirmPassword = !hideConfirmPassword"
                :type="hideConfirmPassword ? 'password' : 'text'"
                required
              />
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions class="tertiary">
          <v-spacer />
          <v-btn text color="primary" @click="onCancel">Annuler</v-btn>
          <v-btn text color="primary" @click="onConfirm" :disabled="disabled">Confirmer</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import checkIfNotEmpty from './Mixins/CheckIfNotEmpty'
import * as types from '../store/mutation-types.js'
export default {
  name: 'changePassword',
  mixins: [checkIfNotEmpty],
  data: () => ({
    hideOldPassword: true,
    hideNewPassword: true,
    hideConfirmPassword: true,
    password: '',
    newPassword: '',
    confirmPassword: '',
    isLoading: false
  }),
  computed: {
    disabled () {
      return (
        this.password.length === 0 ||
        this.newPassword.length === 0 ||
        this.confirmPassword.length === 0 ||
        this.newPassword !== this.confirmPassword
      )
    }
  },
  methods: {
    checkSimilar (input) {
      return input === this.newPassword
        ? true
        : 'Le mot de passe doit être le même'
    },
    onConfirm () {
      this.isLoading = true
      this.$http
        .post('user/password', {
          current_password: this.password,
          password: this.newPassword,
          confirm_password: this.confirmPassword
        })
        .then(
          function () {
            this.isLoading = false
            this.$router.push({ name: 'Home' })
          },
          function (response) {
            this.isLoading = false
            this.$store.commit(types.SET_ERROR_MESSAGE, response.body.error)
          }
        )
    },
    onCancel () {
      this.$router.push({ name: 'Home' })
    }
  }
}
</script>
