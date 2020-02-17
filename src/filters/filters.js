const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
})
const dateValueFormatter = new Intl.DateTimeFormat('fr-FR', {
  month: 'long',
  year: 'numeric'
})

export function dateFilter (value) {
  const date = new Date(value)
  return value ? dateFormatter.format(date) : '-'
}

export function dateValueFilter (value) {
  const date = new Date(value)
  return value ? dateValueFormatter.format(date) : '-'
}

const numberFormatter = new Intl.NumberFormat('fr-FR', { style: 'decimal' })
export function lengthFilter (value) {
  return value ? numberFormatter.format(value) + ' m' : '-'
}

export function TRIFilter (value) {
  return value ? numberFormatter.format(value / 100) + ' %' : '-'
}

const valueFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})
export function valueFilter (value) {
  return value ? valueFormatter.format(value / 100) : '-'
}

const prevFormatter = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})
export function prevFilter (value) {
  return value ? prevFormatter.format(value) + ' M€' : '-'
}

export function valueInput (value) {
  return value ? valueFormatter.format(value / 100) : ''
}

export function yesNoFilter (value) {
  return value ? 'oui' : 'non'
}

const percentageFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'decimal',
  maximumFractionDigits: 2
})
export function percentage (value) {
  return typeof value === 'number'
    ? percentageFormatter.format(100 * value) + ' %'
    : '-'
}

export function truncate (t) {
  if (t === null) return null
  const suffix = t.length > 70 ? ' ...' : ''
  return t.slice(0, 50) + suffix
}

export function intFormat (value) {
  if (value === null) {
    return ''
  }
  return numberFormatter.format(value)
}

export function triFormat (value) {
  if (value === null) {
    return ''
  }
  return numberFormatter.format(0.01 * value)
}

export function percentageInput (value) {
  if (value === null) {
    return ''
  }
  return numberFormatter.format(100 * value)
}

export function percentageInputParse (value) {
  if (value === '') {
    return null
  }
  const parsed = parseFloat(value.replace(/,/g, '.'))
  if (isNaN(parsed)) {
    return null
  }
  return 0.01 * parsed
}
