<template>
  <v-dialog :value="value" @input="$emit('input', false)" max-width="600px" persistent>
    <v-card>
      <v-card-title class="primary white--text title">Inscription à Propera</v-card-title>
      <v-container grid-list-md fluid>
        <v-layout wrap>
          <v-text-field
            label="Nom complet"
            v-model="name"
            :rules="[checkIfNotEmpty]"
            required
            autofocus
            data-cy="signUpFullName"
          />
        </v-layout>
        <v-layout row>
          <v-text-field
            label="email"
            v-model="email"
            :rules="[checkIfNotEmpty, emailCheck]"
            required
            data-cy="signUpEmail"
          />
        </v-layout>
        <v-layout row>
          <v-text-field
            label="Mot de passe"
            v-model="password"
            type="password"
            :rules="[checkIfNotEmpty]"
            @keyup.enter="onCreate"
            required
            data-cy="signUpPassword"
          />
        </v-layout>
      </v-container>
      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn text color="primary" @click="$emit('input', false)" data-cy="signUpCancel">Annuler</v-btn>
        <v-btn
          text
          color="primary"
          @click="onCreate"
          :disabled="disabled"
          :loading="loading"
          data-cy="signUpOk"
        >S'inscrire</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import checkIfNotEmpty from './Mixins/CheckIfNotEmpty'
import * as types from '../store/mutation-types.js'
export default {
  name: 'SignUp',
  mixins: [checkIfNotEmpty],
  props: {
    value: { type: Boolean, default: false }
  },
  data: () => ({
    name: '',
    password: '',
    email: ''
  }),
  computed: {
    disabled () {
      return this.name === '' || this.password === '' || this.email === ''
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    emailCheck (input) {
      /* eslint-disable no-useless-escape */
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      /* eslint-enable no-useless-escape */
      return re.test(input) ? true : 'Adresse email attendue'
    },
    async onCreate () {
      if (!this.disabled) {
        try {
          await this.$http.post('user/signup', {
            name: this.name,
            email: this.email,
            password: this.password
          })
          this.$emit('success')
          this.$emit('input', false)
        } catch (response) {
          if (response.status === 422) {
            this.$store.commit(types.SET_ERROR_MESSAGE,
              'L\'adresse email est déjà utilisée')
          }
        }
      }
    }
  }
}
</script>
