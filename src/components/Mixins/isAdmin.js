export default {
  computed: {
    isAdmin () {
      return this.$store.state.token.isAdmin
    }
  }
}
