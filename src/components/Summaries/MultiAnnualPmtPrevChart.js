import { Bar } from 'vue-chartjs'
const currentYear = new Date().getFullYear()
export default {
  extends: Bar,
  name: 'MultiAnnualPmtPrevChart',
  data () {
    return {
      paymentDatas: {
        labels: [
          String(currentYear),
          String(currentYear + 1),
          String(currentYear + 2),
          String(currentYear + 3),
          String(currentYear + 4)
        ]
      }
    }
  },
  computed: {
    items () {
      return this.$store.state.previsions.paymentPrevisions
    }
  },
  watch: {
    items () {
      this.paymentDatas.datasets = [
        {
          backgroundColor: '#A5D6A7',
          data: this.items.map(i => (i.pmtMin)),
          label: 'Min par prev direct'
        },
        {
          backgroundColor: '#4CAF50',
          data: this.items.map(i => (i.difPmt)),
          label: 'Par RAM'
        },
        {
          backgroundColor: '#388E3C',
          data: this.items.map(i => (i.pmtMax)),
          label: 'Max par prev direct'
        }
      ]
      this.renderChart(this.paymentDatas, {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          yAxes: [
            {
              ticks: {
                fontFamily: 'Roboto',
                callback: (val, idx, vals) => `${val} M€`,
                min: 0
              }
            }
          ],
          xAxes: [{ ticks: { fontFamily: 'Roboto' } }]
        },
        tooltips: {
          titleFontFamily: 'Roboto',
          bodyFontFamily: 'Roboto',
          backgroundColor: '#1B5E20CC',
          callbacks: {
            label: function (t, d) {
              return (
                `${d.datasets[t.datasetIndex].label} : ${t.yLabel.toFixed(1)} M€`
              )
            }
          }
        }
      })
    }
  }
}
