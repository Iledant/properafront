<template>
  <v-card :color="color" :dark="dark">
    <v-card-text>
      <div class="text-headline-4">{{ figure }}</div>
      <div>
        <v-icon>{{trend >= 0 ? 'arrow_upward' : 'arrow_downward'}}</v-icon>
        {{ trend | percentage }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'TrendName',
  props: {
    color: { type: String, default: 'primary' },
    figure: { type: Number, default: null },
    trend: { type: Number, default: null },
    dark: { type: Boolean, default: false }
  }
}
</script>
