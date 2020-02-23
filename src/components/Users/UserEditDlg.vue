<template>
  <v-dialog :value="value" max-width="600px" v-if="user" persistent>
    <v-card class="mt-2">
      <v-card-title class="secondary">{{ mentions.title }}</v-card-title>
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              label="Nom complet"
              v-model="user.name"
              :rules="[checkIfNotEmpty]"
              data-cy="userDlgName"
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="email"
              v-model="user.email"
              :rules="[checkIfNotEmpty, emailCheck]"
              data-cy="userDlgEmail"
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="Mot de passe"
              v-model="user.password"
              type="password"
              data-cy="userDlgPassword"
            />
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs6>
            <v-select
              :items="items"
              v-model="user.role"
              label="Rôle"
              data-cy="userDlgRole"
            />
          </v-flex>
          <v-flex xs6>
            <v-checkbox
              label="Activé ?"
              v-model="user.active"
              data-cy="userDlgActive"
            />
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn
          color="primary"
          text @click="$emit('input', false)"
          data-cy="useDlgCancel"
        >
          Annuler
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="onSave"
          :disabled="disabled"
          data-cy="userDlgSave"
        >
          {{ mentions.validate }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import checkIfNotEmpty from '../Mixins/CheckIfNotEmpty'
export default {
  name: 'UserEditDlg',
  mixins: [checkIfNotEmpty],
  props: {
    user: Object,
    value: { type: Boolean, default: false },
    mentions: Object
  },
  data: () => ({
    items: [
      { text: 'Utilisateur', value: 'USER' },
      { text: 'Observateur', value: 'OBSERVER' },
      { text: 'Administrateur', value: 'ADMIN' }
    ]
  }),
  computed: {
    disabled () {
      if (this.mentions && this.mentions.validate === 'Créer') {
        return (
          !this.user.email ||
          !this.user.name ||
          !this.user.password ||
          !this.emailCheck(this.user.email)
        )
      }
      return (
        !this.user.email || !this.user.name || !this.emailCheck(this.user.email)
      )
    }
  },
  methods: {
    emailCheck (input) {
      /* eslint-disable no-useless-escape */
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      /* eslint-enable no-useless-escape */
      return re.test(input) || 'Adresse email attendue'
    },
    onSave () {
      if (this.disabled) return
      this.$emit('save')
      this.$emit('input', false)
    }
  }
}
</script>
