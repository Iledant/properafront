import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  data: () => ({
    datas: {
      datasets: [
        {
          backgroundColor: '#1B5E20',
          pointBackgroundColor: '#1B5E20',
          label: ' Évolution des CSF',
          data: []
        },
        {
          backgroundColor: '#0D47A1',
          pointBackgroundColor: '#0D47A1',
          label: ' Évolution des traitements',
          fill: false,
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
      this.datas.datasets[0].data = list.map(a => a.uncontrolled)
      this.datas.datasets[1].data = list.map(a => a.unprocessed)
      this.datas.labels = list.map(a =>
        new Date(a.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }))
      this.renderChart(this.datas, this.options)
    }
  }
}
