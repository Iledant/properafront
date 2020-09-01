import { parse } from 'vue-currency-input'

const currencyFormat = c => new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2
}).format(c)

export default {
  methods: {
    parseCurrency (c) {
      return c !== '' ? parseInt(100 * parse(c)) : null
    },
    formatCurrency (c) {
      return c !== null ? currencyFormat(c * 0.01) : ''
    }
  }
}
