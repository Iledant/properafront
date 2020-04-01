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
          label: ' Évolution des CSF',
          data: []
        },
        {
          borderColor: '#0D47A1',
          pointBackgroundColor: '#0D47A1',
          fill: false,
          borderWidth: 2,
          cubicInterpolationMode: 'monotone',
          label: ' Évolution des traitements DC',
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
    paymentDemandCount () {
      return this.$store.state.paymentDemands.paymentDemandCount
    }
  },
  watch: {
    paymentDemandCount (list) {
      this.datas.datasets[0].data = list.map(a => -a.uncontrolled)
      this.datas.datasets[1].data = list.map(a => -a.unprocessed)
      this.datas.labels = list.map(a =>
        new Date(a.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }))
      this.renderChart(this.datas, this.options)
    }
  }
}
