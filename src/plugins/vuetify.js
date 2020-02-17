import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/lib/util/colors'
import fr from 'vuetify/es5/locale/fr'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.green.darken4,
        secondary: colors.green.lighten3,
        tertiary: colors.green.lighten5
      }
    }
  },
  lang: {
    locales: { fr },
    current: 'fr'
  },
  icons: {
    iconfont: 'md'
  }
})
