<template>
  <v-card :color="colors[colorIndex]">
    <v-card-text>
      <div class="caption">{{ caption }}</div>
      <div class="text-right text-h3">{{ figure }}</div>
      <div class="caption text-right">
        <v-icon small>{{icons[iconIndex]}}</v-icon>
        {{ trend }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'TrendCard',
  props: {
    caption: { type: String, default: '' },
    figure: { type: String, default: '-' },
    trend: { type: String, default: '-' },
    sign: { type: Boolean, default: true }
  },
  data () {
    return {
      icons: ['north_east', 'east', 'south_east'],
      colors: ['green lighten-4', 'yellow lighten-4', 'red lighten-4']
    }
  },
  computed: {
    iconIndex () {
      if (this.trend === 0) {
        return 1
      }
      if (this.trend > 0) {
        return this.sign ? 0 : 2
      }
      return this.sign ? 2 : 0
    },
    colorIndex () {
      return this.sign ? this.iconIndex : 2 - this.iconIndex
    }
  }
}
</script>
