import { Line } from 'vue-chartjs'

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
      ],
      datasets: [
        {
          borderColor: '#F44336',
          pointBackgroundColor: '#F44336',
          fill: false,
          borderWidth: 2,
          cubicInterpolationMode: 'monotone',
          data: []
        },
        {
          backgroundColor: '#A5D6A7',
          borderColor: '#1B5E20',
          pointBackgroundColor: '#1B5E20',
          cubicInterpolationMode: 'monotone',
          data: []
        },
        {
          backgroundColor: '#E8F5E9',
          pointBackgroundColor: '#C8E6C9',
          borderColor: '#C8E6C9',
          label: ' Crédits disponibles',
          cubicInterpolationMode: 'monotone',
          data: []
        }
      ]
    }
  }),
  computed: {
    paymentPerMonth () {
      return this.$store.state.previsions.paymentsPerMonthList
    },
    paymentCredits () {
      return this.$store.state.previsions.paymentCredits.reduce((a, c) =>
        c.Chapter === 907 || c.Chapter === 908
          ? a + c.Primitive + c.Reported + c.Added + c.Modified + c.Movement
          : a, 0) * 0.00000001 || 0
    }
  },
  watch: {
    paymentPerMonth (list) {
      const currentValues = []
      const pastValues = []
      let currentCumulated = 0
      let pastCumulated = 0
      list.forEach(l => {
        const value = l.value * 0.00000001
        const month = l.month
        if (l.year === this.currentYear) {
          while (currentValues.length < month - 1) {
            currentValues.push(currentCumulated)
          }
          currentCumulated += value
          currentValues.push(currentCumulated)
        } else {
          while (pastValues.length < month - 1) {
            pastValues.push(pastCumulated)
          }
          pastCumulated += value
          pastValues.push(pastCumulated)
        }
      })
      this.paymentDatas.datasets[2].data = Array(12).fill(this.paymentCredits)
      this.paymentDatas.datasets[1].data = currentValues
      this.paymentDatas.datasets[1].label = this.currentYear
      this.paymentDatas.datasets[0].data = pastValues
      this.paymentDatas.datasets[0].label = this.currentYear - 1
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
            label: (i, d) =>
              `${d.datasets[i.datasetIndex].label} : ${i.yLabel.toFixed(1)} M€`
          }
        }
      })
    }
  }
}
