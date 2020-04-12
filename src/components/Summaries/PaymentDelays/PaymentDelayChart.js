import { Bar } from 'vue-chartjs'
import { mapState } from 'vuex'

export default {
  extends: Bar,
  data: () => ({
    paymentDatas: {
      labels: [],
      datasets: [
        {
          backgroundColor: '#C8E6C9',
          borderColor: '#4CAF50',
          borderWidth: 1,
          data: []
        }
      ]
    }
  }),
  computed: {
    ...mapState({
      paymentDelays: state => state.paymentDelays.paymentDelays
    })
  },
  watch: {
    paymentDelays () {
      this.paymentDatas.labels = [...this.paymentDelays.map(p => '< ' + p.delay + ' j')]
      this.paymentDatas.datasets[0].data = this.paymentDelays.map(p => p.number)
      this.renderChart(this.paymentDatas, {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                fontFamily: 'Roboto',
                callback: (val, idx, vals) => `${val}`
              }
            }
          ],
          xAxes: [{ ticks: { fontFamily: 'Roboto' } }]
        },
        tooltips: {
          titleFontFamily: 'Roboto',
          bodyFontFamily: 'Roboto',
          backgroundColor: '#4CAF50CC'
          // callbacks: {
          //   label: (i, d) =>
          //     `${d.datasets[i.datasetIndex].label} : ${i.yLabel.toFixed(0)}`
          // }
        }
      })
    }
  }
}
