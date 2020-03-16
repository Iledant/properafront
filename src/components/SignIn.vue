<template>
  <v-dialog :value="value" @input="$emit('input', false)" max-width="600px" persistent>
    <v-card>
      <v-card-title class="primary white--text">Connexion</v-card-title>
      <v-container grid-list-md fluid>
        <v-layout row>
          <v-flex xs12>
            <v-text-field
              label="email"
              v-model="email"
              :rules="[checkIfNotEmpty]"
              required
              autofocus
              data-cy="email"
            />
            <v-text-field
              label="Mot de passe"
              v-model="password"
              :rules="[checkIfNotEmpty]"
              :prepend-icon="icon"
              @click:append="showPassword = !showPassword"
              :type="type"
              required
              @keyup.enter="onSend"
              data-cy="password"
            />
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions class="tertiary">
        <v-btn text color="primary" @click="showSignUp = true" data-cy="signUp">
          S'inscrire
        </v-btn>
        <v-spacer />
        <v-btn
          text
          color="primary"
          @click="onSend"
          :disabled="disabled"
          :loading="loading"
          data-cy="logIn"
        >Se connecter</v-btn>
      </v-card-actions>
    </v-card>
    <sign-up v-model="showSignUp" @success="showSuccess=true" />
    <v-dialog v-model="showSuccess" max-width="600px" persistent>
      <v-card>
        <v-card-title class="primary white--text">
          Votre compte est créé
        </v-card-title>
        <v-card-text>
          <p class="pt-4">
            Votre compte est créé et vous pourrez vous connecter avec l'adresse
            email et le mot de passe que vous avez fournis.
            </P>
            <p>
            Pour l'instant et pour des raisons de sécurité, votre compte n'est pas
            été activé. Il doit l'être par un administrateur avant que tout ne
            fonctionne normalement pour vous.
          </p>
        </v-card-text>
        <v-card-actions class="tertiary">
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="showSuccess = false"
            data-cy="successOk"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import * as types from '@/store/mutation-types.js'
import checkIfNotEmpty from '@/components/Mixins/CheckIfNotEmpty'
import SignUp from './SignUp.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'SignIn',
  mixins: [checkIfNotEmpty],
  components: { SignUp },
  props: {
    value: { type: Boolean, default: false }
  },
  data: () => ({
    email: '',
    password: '',
    showPassword: false,
    showSignUp: false,
    showSuccess: false
  }),
  computed: {
    ...mapGetters(['loading']),
    icon () {
      return this.showPassword ? 'visibility' : 'visibility_off'
    },
    type () {
      return this.showPassword ? 'text' : 'password'
    },
    disabled () {
      return !this.email || !this.password
    }
  },
  methods: {
    async onSend () {
      if (!this.disabled) {
        await this.$store.dispatch(types.SIGN_IN, {
          email: this.email,
          password: this.password,
          router: this.$router
        })
      }
    }
  }
}
</script>
