import { Bar } from 'vue-chartjs'
import { mapState } from 'vuex'

export default {
  extends: Bar,
  name: 'PaymentDelayChart',
  props: {
    cumulated: { type: Boolean, default: false }
  },
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
    },
    options: {
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
      }
    }
  }),
  methods: {
    render () {
      if (!this.paymentDelays.length) {
        return
      }
      const dataset = this.paymentDatas.datasets[0]
      if (this.cumulated) {
        dataset.data = this.paymentDelays.map(p => p.number)
        this.paymentDatas.labels = [...this.paymentDelays.map(p => '< ' + p.delay + ' j')]
      } else {
        dataset.data = new Array(this.paymentDelays.length)
        this.paymentDatas.labels = new Array(this.paymentDelays.length)
        dataset.data[0] = this.paymentDelays[0].number
        this.paymentDatas.labels[0] = '< ' + this.paymentDelays[0].delay + ' j'
        for (let i = 1; i < this.paymentDelays.length; i++) {
          dataset.data[i] =
            this.paymentDelays[i].number - this.paymentDelays[i - 1].number
          this.paymentDatas.labels[i] = this.paymentDelays[i - 1].delay + ' - ' + this.paymentDelays[i].delay
        }
      }
      this.renderChart(this.paymentDatas, this.options)
    }
  },
  computed: {
    ...mapState({
      paymentDelays: state => state.paymentDelays.paymentDelays
    })
  },
  watch: {
    paymentDelays () {
      this.render()
    },
    cumulated () {
      this.render()
    }
  }
}
