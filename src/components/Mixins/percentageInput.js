const format = c => new Intl.NumberFormat('fr-FR',
  { style: 'decimal', maximumFractionDigits: 2 }).format(c)

export default {
  methods: {
    parsePercentage (c) {
      return c !== '' ? 0.01 * parseFloat(String(c).replace(',', '.')) : null
    },
    formatPercentage (c) {
      return c !== null ? format(c * 100) : ''
    }
  }
}
