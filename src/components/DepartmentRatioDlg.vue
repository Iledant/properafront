<template>
  <v-dialog :value="value" max-width="600px" persistent>
    <v-card>
      <v-card-title class="primary white--text">
        Ratios de « {{ ratios.fullName }} »
      </v-card-title>
      <v-container grid-list-md fluid>
        <v-layout row>
          <v-flex xs6>
            <v-text-field
              label="Taux 75"
              v-model="fmtR75"
              v-percentage-input
              reverse
              prefix="%"
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="Taux 77"
              v-model="fmtR77"
              v-percentage-input
              reverse
              prefix="%"
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="Taux 78"
              v-model="fmtR78"
              v-percentage-input
              reverse
              prefix="%"
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="Taux 91"
              v-model="fmtR91"
              v-percentage-input
              reverse
              prefix="%"
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="Taux 92"
              v-model="fmtR92"
              v-percentage-input
              reverse
              prefix="%"
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="Taux 93"
              v-model="fmtR93"
              v-percentage-input
              reverse
              prefix="%"
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="Taux 94"
              v-model="fmtR94"
              v-percentage-input
              reverse
              prefix="%"
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="Taux 95"
              v-model="fmtR95"
              v-percentage-input
              reverse
              prefix="%"
            />
          </v-flex>
          <v-flex xs12>Total : {{ fmtTotal }}</v-flex>
          <v-flex xs12 class="error" v-show="badTotal">
            Le total doit faire 100 %
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn small text @click="$emit('input', false)">Annuler</v-btn>
        <v-btn small text :disabled="disabled" @click="modify">Modifier</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import percentageInput from './Mixins/percentageInput'
export default {
  name: 'DepartmentRatioDlg',
  mixins: [percentageInput],
  props: {
    value: { type: Boolean, default: false },
    ratios: { type: Object, default: v => {} }
  },
  data () {
    return {
      fmtR75: '',
      fmtR77: '',
      fmtR78: '',
      fmtR91: '',
      fmtR92: '',
      fmtR93: '',
      fmtR94: '',
      fmtR95: ''
    }
  },
  computed: {
    total () {
      return 0.01 * (this.parse(this.fmtR75) + this.parse(this.fmtR77) +
        this.parse(this.fmtR78) + this.parse(this.fmtR91) +
        this.parse(this.fmtR92) + this.parse(this.fmtR93) +
        this.parse(this.fmtR94) + this.parse(this.fmtR95))
    },
    badTotal () {
      return this.total < 0.999 || this.total > 1.001
    },
    fmtTotal () {
      return this.formatPercentage(this.total) + ' %'
    },
    disabled () {
      return !this.fmtR75 || !this.fmtR77 || !this.fmtR78 || !this.fmtR91 ||
        !this.fmtR92 || !this.fmtR93 || !this.fmtR94 || !this.fmtR95 ||
        this.badTotal
    }
  },
  methods: {
    modify () {
      if (this.disabled) return
      this.ratios.r75 = this.parsePercentage(this.fmtR75)
      this.ratios.r77 = this.parsePercentage(this.fmtR77)
      this.ratios.r78 = this.parsePercentage(this.fmtR78)
      this.ratios.r91 = this.parsePercentage(this.fmtR91)
      this.ratios.r92 = this.parsePercentage(this.fmtR92)
      this.ratios.r93 = this.parsePercentage(this.fmtR93)
      this.ratios.r94 = this.parsePercentage(this.fmtR94)
      this.ratios.r95 = this.parsePercentage(this.fmtR95)
      this.$emit('modify')
      this.$emit('input', false)
    },
    parse (c) {
      return c === '' ? 0 : parseFloat(String(c).replace(',', '.'))
    }
  },
  watch: {
    value () {
      this.fmtR75 = this.formatPercentage(this.ratios.r75)
      this.fmtR77 = this.formatPercentage(this.ratios.r77)
      this.fmtR78 = this.formatPercentage(this.ratios.r78)
      this.fmtR91 = this.formatPercentage(this.ratios.r91)
      this.fmtR92 = this.formatPercentage(this.ratios.r92)
      this.fmtR93 = this.formatPercentage(this.ratios.r93)
      this.fmtR94 = this.formatPercentage(this.ratios.r94)
      this.fmtR95 = this.formatPercentage(this.ratios.r95)
    }
  }
}
</script>
