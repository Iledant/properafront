const intFormatter = v => new Intl.NumberFormat(
  'fr-FR',
  { maximumFractionDigits: 0 }).format(v)

const spaceCount = s => {
  const spaces = s.match(/\s/g)
  return spaces ? spaces.length : 0
}

function format (el) {
  const initVal = String(el.value)
  const v = initVal.replace(/[^\d]/g, '')
  const carPos = el.selectionStart
  const spacesBefore = spaceCount(initVal.substring(0, carPos))
  el.value = intFormatter(v)
  const spacesAfter = spaceCount(el.value.substring(0, carPos))
  const newPos = Math.max(carPos + spacesAfter - spacesBefore, 0)
  el.setSelectionRange(newPos, newPos)
}

export default {
  bind (el) {
    const inputElement = el.matches('input') ? el : el.querySelector('input')
    inputElement.addEventListener('input', () => { format(inputElement) }, { capture: true })
  }
}
