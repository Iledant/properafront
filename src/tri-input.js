// tri-input directive is only used by OpEditDlg for the TRI field
// TRI is stored as an int on the backend and encapsulates a percentage by being
// multiplied by 100. Therefore, the possible pattern is \d{1,3},\d{0,2}
// The directive filters the input to match that pattern

function format (el) {
  const initVal = el.value.replace(/,/, '.')
  const parts = initVal.split('.')
  const first = parts[0].replace(/[^\d]/g, '')
  const last = parts[1] !== undefined
    ? parts[1].replace(/[^\d]/g, '').substring(0, 2)
    : undefined
  const carPos = el.selectionStart
  el.value = first + (last !== undefined ? ',' + last : '')
  const newPos = Math.max(carPos - initVal.length + el.value.length, 0)
  el.setSelectionRange(newPos, newPos)
}

export default {
  bind (el) {
    const inputElement = el.matches('input') ? el : el.querySelector('input')
    inputElement.addEventListener('input', () => { format(inputElement) }, { capture: true })
  }
}
