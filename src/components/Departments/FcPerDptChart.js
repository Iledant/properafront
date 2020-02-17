import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  data: () => ({
    paymentDatas: {
      labels: [
        'Paris',
        'Seine-et-Marne',
        'Yvelines',
        'Essonne',
        'Hauts-de-Seine',
        'Seine-Saint-Denis',
        'Val-de-Marne',
        'Val d\'Oise'
      ],
      datasets: [
        {
          backgroundColor: [
            '#33691E',
            '#1B5E20',
            '#4CAF50',
            '#81C784',
            '#689F38',
            '#8BC34A',
            '#AED581',
            '#C8E6C9'
          ],
          data: []
        }
      ]
    }
  }),
  computed: {
    fcPerDpt () {
      return this.$store.state.dptRatios.commitmentsPerDpt
    }
  },
  watch: {
    fcPerDpt (list) {
      if (list.length > 0) {
        const val = list[0]
        this.paymentDatas.datasets[0].data = [
          val.fc75 ? Number(val.fc75) * 0.00000001 : 0,
          val.fc77 ? Number(val.fc77) * 0.00000001 : 0,
          val.fc78 ? Number(val.fc78) * 0.00000001 : 0,
          val.fc91 ? Number(val.fc91) * 0.00000001 : 0,
          val.fc92 ? Number(val.fc92) * 0.00000001 : 0,
          val.fc93 ? Number(val.fc93) * 0.00000001 : 0,
          val.fc94 ? Number(val.fc94) * 0.00000001 : 0,
          val.fc95 ? Number(val.fc95) * 0.00000001 : 0
        ]
      }
      this.renderChart(this.paymentDatas, {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        tooltips: {
          titleFontFamily: 'Roboto',
          bodyFontFamily: 'Roboto',
          backgroundColor: '#1B5E20CC',
          callbacks: {
            label (t, d) {
              return (
                `${d.labels[t.index]} : ${d.datasets[0].data[t.index].toFixed(2)}  M€`
              )
            }
          }
        }
      })
    }
  }
}
