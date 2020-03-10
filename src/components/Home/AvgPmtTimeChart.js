import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  data: () => ({
    currentYear: new Date().getFullYear(),
    datas: {
      datasets: [
        {
          borderColor: '#F44336',
          pointBackgroundColor: '#F44336',
          fill: false,
          borderWidth: 2,
          cubicInterpolationMode: 'monotone',
          label: 'Délai moyen',
          data: [],
          yAxisID: 'time-axis'
        },
        {
          backgroundColor: '#A5D6A7',
          type: 'bar',
          label: 'Écart type',
          data: [],
          yAxisID: 'deviation-axis'
        }
      ]
    }
  }),
  computed: {
    avgPmtTime () {
      return this.$store.state.previsions.averagePaymentTime
    }
  },
  watch: {
    avgPmtTime (list) {
      this.datas.datasets[0].data = this.avgPmtTime.map(a => a.average_time)
      this.datas.datasets[1].data = this.avgPmtTime.map(a => a.standard_deviation)
      this.datas.labels = this.avgPmtTime.map(a =>
        new Date(a.month).toLocaleDateString('fr-FR', { month: '2-digit', year: '2-digit' }))
      this.renderChart(this.datas, {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          yAxes: [
            {
              id: 'time-axis',
              type: 'linear',
              ticks: {
                fontFamily: 'Roboto',
                min: 0,
                callback: (val, idx, vals) => `${val} j`
              }
            },
            {
              id: 'deviation-axis',
              type: 'linear',
              position: 'right',
              ticks: {
                fontFamily: 'Roboto',
                min: 0,
                callback: (val, idx, vals) => `${val} j`
              },
              min: 0
            }
          ],
          xAxes: [{ ticks: { fontFamily: 'Roboto' } }]
        },
        tooltips: {
          titleFontFamily: 'Roboto',
          bodyFontFamily: 'Roboto',
          backgroundColor: '#1B5E20CC',
          callbacks: {
            label: (i, d) =>
              `${d.datasets[i.datasetIndex].label} : ${i.yLabel.toFixed(1)} j`
          }
        }
      })
    }
  }
}
