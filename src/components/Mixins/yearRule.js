export default {
  methods: {
    yearRule (y) {
      return /^20\d\d$/.test(y) || 'Année requise'
    }
  }
}
