import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  data: () => ({
    datas: {
      datasets: [
        {
          borderColor: '#1B5E20',
          pointBackgroundColor: '#1B5E20',
          fill: false,
          borderWidth: 2,
          cubicInterpolationMode: 'monotone',
          label: ' DVS sans CSF',
          data: []
        },
        {
          borderColor: '#0D47A1',
          pointBackgroundColor: '#0D47A1',
          fill: false,
          borderWidth: 2,
          cubicInterpolationMode: 'monotone',
          label: ' DVS non traités DC',
          data: []
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: { display: false },
      scales: {
        yAxes: [{ ticks: { fontFamily: 'Roboto' } }],
        xAxes: [{ ticks: { fontFamily: 'Roboto' } }]
      },
      tooltips: {
        titleFontFamily: 'Roboto',
        bodyFontFamily: 'Roboto',
        backgroundColor: '#1B5E20CC',
        callbacks: {
          label: (i, d) =>
            `${d.datasets[i.datasetIndex].label} : ${i.yLabel.toFixed(0)}`
        }
      }
    }
  }),
  computed: {
    paymentDemandsStock () {
      return this.$store.state.paymentDemands.paymentDemandsStock
    }
  },
  watch: {
    paymentDemandsStock (list) {
      this.datas.datasets[0].data = list.map(a => a.csf)
      this.datas.datasets[1].data = list.map(a => a.dc)
      this.options.scales.yAxes[0].ticks.min = 0
      this.datas.labels = list.map(a =>
        new Date(a.day).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }))
      this.renderChart(this.datas, this.options)
    }
  }
}
