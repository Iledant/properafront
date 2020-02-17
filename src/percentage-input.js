// percentage-input directive is used by OpPrevision for state_ratio field.
// The state-ratio field is stored as a float (golang float64)
// On an input according to 'fr-FR' locale, the pattern is {100|[1-9]?[0-9]}(,\d+)
// The directive format the input to match this pattern as much as possible

function format (el) {
  const initVal = el.value.replace(/\./, ',')
  const parts = initVal.split(',')
  const first = parts[0] === '' ? 0 : Math.min(Math.max(parseInt(parts[0].replace(/[^\d]/g, '')), 0), 100)
  const last = parts[1] !== undefined
    ? parts[1].replace(/[^\d]/g, '')
    : undefined
  const carPos = el.selectionStart
  if (first === 100) {
    el.value = '100'
  } else {
    el.value = first + (last !== undefined ? ',' + last : '')
  }
  const newPos = Math.max(carPos - initVal.length + el.value.length, 0)
  el.setSelectionRange(newPos, newPos)
}

export default {
  bind (el) {
    const inputElement = el.matches('input') ? el : el.querySelector('input')
    inputElement.addEventListener('input', () => { format(inputElement) }, { capture: true })
  }
}
