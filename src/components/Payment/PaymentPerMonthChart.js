import { Line } from 'vue-chartjs'
import convertQueryChroniclesToChartDataset from '@/components/Utils/convertQueryChroniclesToChartDataset.js'

export default {
  extends: Line,
  data: () => ({
    currentYear: new Date().getFullYear(),
    paymentDatas: {
      labels: [
        'jan',
        'fév',
        'mar',
        'avr',
        'mai',
        'jun',
        'jul',
        'aoû',
        'sep',
        'oct',
        'nov',
        'déc'
      ]
    }
  }),
  computed: {
    paymentPerMonth () {
      return this.$store.state.previsions.allPaymentsPerMonthList
    }
  },
  watch: {
    paymentPerMonth (list) {
      this.paymentDatas.datasets = convertQueryChroniclesToChartDataset(list)
      this.renderChart(this.paymentDatas, {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          yAxes: [
            {
              ticks: {
                fontFamily: 'Roboto',
                callback: (val, idx, vals) => `${val} M€`
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
            label: (t, d) =>
              `${d.datasets[t.datasetIndex].label} : ${t.yLabel.toFixed(1)} M€`
          }
        }
      })
    }
  }
}
