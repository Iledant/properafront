export default function convertQueryChroniclesToChartDataset (list) {
  let currentValues = []
  let cumulated = 0
  let month = 1
  let currentYear = list ? list[0].year : null
  const dataset = []
  list.forEach(l => {
    if (l.year !== currentYear) {
      while (month < 13) {
        currentValues.push(cumulated)
        month++
      }
      dataset.push({
        borderColor: '#A5D6A7',
        pointBackgroundColor: '#A5D6A7',
        borderWidth: 1,
        fill: false,
        data: currentValues,
        cubicInterpolationMode: 'monotone',
        label: currentYear
      })
      currentValues = []
      month = 1
      currentYear = l.year
      cumulated = 0
    }
    while (month < l.month) {
      currentValues.push(cumulated)
      month++
    }
    cumulated = l.cumulated * 0.000001
    currentValues.push(cumulated)
    month++
  })
  dataset.splice(0, 0, {
    borderColor: '#1B5E20',
    pointBackgroundColor: '#1B5E20',
    fill: false,
    data: currentValues,
    cubicInterpolationMode: 'monotone',
    label: currentYear
  })
  return dataset
}
