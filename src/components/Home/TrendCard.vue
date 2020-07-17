<template>
  <v-card :color="color">
    <v-card-text>
      <div class="caption">{{ caption }}</div>
      <div class="text-right text-h3">{{ figure }}</div>
      <div class="caption text-right">
        <v-icon small>{{icon}}</v-icon>
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
    trend: { type: String, default: '-' }
  },
  computed: {
    icon () {
      if (this.trend > 0) {
        return 'north_east'
      }
      if (this.trend < 0) {
        return 'south_east'
      }
      return 'east'
    },
    color () {
      if (this.trend < 0) {
        return 'red lighten-4'
      }
      if (this.trend > 0) {
        return 'green lighten-4'
      }
      return 'yellow lighten-4'
    }
  }
}
</script>
