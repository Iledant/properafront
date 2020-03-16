import { Line } from 'vue-chartjs'
import convertQueryChroniclesToChartDataset from '../Utils/convertQueryChroniclesToChartDataset.js'
import * as types from '@/store/mutation-types'

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
  props: { beneficiaryId: null },
  computed: {
    chronicles () {
      return this.$store.state.previsions.beneficiaryPaymentsChronicles
    }
  },
  watch: {
    beneficiaryId (newId) {
      this.$store.dispatch(types.GET_BEN_PMT_CHRONICLES,
        { beneficiaryId: newId })
    },
    chronicles (list) {
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
