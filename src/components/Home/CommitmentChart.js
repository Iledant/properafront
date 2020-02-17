import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  data: () => ({
    currentYear: new Date().getFullYear(),
    fcDatas: {
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
          borderColor: '#0D47A1',
          pointBackgroundColor: '#0D47A1',
          fill: false,
          borderDash: [10, 10],
          label: ' Programmation',
          cubicInterpolationMode: 'monotone',
          data: []
        },
        {
          backgroundColor: '#A5D6A7',
          pointBackgroundColor: '#1B5E20',
          borderColor: '#1B5E20',
          label: ' Affectation',
          cubicInterpolationMode: 'monotone',
          data: []
        },
        {
          backgroundColor: '#E8F5E9',
          pointBackgroundColor: '#C8E6C9',
          borderColor: '#C8E6C9',
          label: ' Budget hors gel et MER',
          cubicInterpolationMode: 'monotone',
          data: []
        },
        {
          backgroundColor: '#FFFDE7',
          pointBackgroundColor: '#FFF9C4',
          borderColor: '#FFF9C4',
          label: ' Budget hors gel',
          cubicInterpolationMode: 'monotone',
          data: []
        },
        {
          backgroundColor: '#E57373',
          pointBackgroundColor: '#F44336',
          borderColor: '#F44336',
          label: ' Budget voté',
          cubicInterpolationMode: 'monotone',
          data: []
        }
      ]
    }
  }),
  computed: {
    fcPerMonth () {
      return this.$store.state.previsions.fcPerMonthList
    },
    programmingsPerMonth () {
      return this.$store.state.previsions.programmingsPerMonthList
    },
    creditsList () {
      return this.$store.state.budgetTables.monthCreditsList
    }
  },
  watch: {
    fcPerMonth (list) {
      const currentValues = []
      const programmingsValues = []
      const primaryValues = []
      const reservedValues = []
      const frozenValues = []
      let primary = 0
      let reserved = 0
      let frozen = 0
      for (let i = 1, j = 0; i <= 12; i++) {
        while (j < this.creditsList.length && this.creditsList[j].month === i) {
          primary += this.creditsList[j].primary_commitment * 0.00000001
          reserved += this.creditsList[j].reserved_commitment * 0.00000001
          frozen += this.creditsList[j].frozen_commitment * 0.00000001
          j++
        }
        frozenValues.push(primary)
        reservedValues.push(primary + frozen)
        primaryValues.push(primary + frozen + reserved)
        if (
          j < this.creditsList.length &&
          this.creditsList[j].month === i + 1
        ) {
          primary = 0
          reserved = 0
          frozen = 0
        }
      }
      let currentCumulated = 0
      list.forEach(l => {
        const value = l.value * 0.00000001
        while (currentValues.length < l.month - 1) {
          currentValues.push(currentCumulated)
        }
        currentCumulated += value
        currentValues.push(currentCumulated)
      })
      let programmingsCumulated = 0
      this.programmingsPerMonth.forEach(p => {
        const value = p.value * 0.00000001
        while (programmingsValues.length < p.month - 1) {
          programmingsValues.push(programmingsCumulated)
        }
        programmingsCumulated += value
        programmingsValues.push(programmingsCumulated)
      })
      this.fcDatas.datasets[0].data = programmingsValues
      this.fcDatas.datasets[1].data = currentValues
      this.fcDatas.datasets[2].data = primaryValues
      this.fcDatas.datasets[3].data = reservedValues
      this.fcDatas.datasets[4].data = frozenValues
      this.renderChart(this.fcDatas, {
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
