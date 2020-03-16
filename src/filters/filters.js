const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
})

/**
 * Filter a nullable date to display a complete locale format
 * @param {date} value - nullable value to filter
*/
export function dateFilter (value) {
  const date = new Date(value)
  return value ? dateFormatter.format(date) : '-'
}

const shortDateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit'
})

/**
 * Filter a nullable date to display a short locale format with day and month
 * @param {date} value - nullable value to filter
*/
export function shortDateFilter (value) {
  const date = new Date(value)
  return value ? shortDateFormatter.format(date) : '-'
}

const dateValueFormatter = new Intl.DateTimeFormat('fr-FR', {
  month: 'long',
  year: 'numeric'
})

/**
 * Filter a nullable date to display a locale format with long month and year
 * @param {date} value - nullable value to filter
*/
export function dateValueFilter (value) {
  const date = new Date(value)
  return value ? dateValueFormatter.format(date) : '-'
}

const numberFormatter = new Intl.NumberFormat('fr-FR', { style: 'decimal' })

/**
 * Filter a nullable value to display length with m postfix and locale format
 * @param {number} value - nullable value to filter
*/
export function lengthFilter (value) {
  return value ? numberFormatter.format(value) + ' m' : '-'
}

/**
 * Filter a nullable value to display percentage with % postfix and locale format
 * @param {number} value - nullable value to filter
*/
export function TRIFilter (value) {
  return value ? numberFormatter.format(value / 100) + ' %' : '-'
}

const valueFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

/**
 * Filter a nullable value to display value dividing by 100 and locale format
 * @param {number} value - nullable value to filter
*/
export function valueFilter (value) {
  return value ? valueFormatter.format(value / 100) : '-'
}

const prevFormatter = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

/**
 * Filter a nullable value to display number with M€ postfix and locale format with
 * 2 digits after comma
 * @param {number} value - nullable value to filter
*/
export function prevFilter (value) {
  return value ? prevFormatter.format(value) + ' M€' : '-'
}

/**
 * Format a nullable value to display value dividing by 100 and empty string
 * when null
 * @param {number} value - nullable value to format
*/
export function valueInput (value) {
  return value ? valueFormatter.format(value / 100) : ''
}

/**
 * Filter a boolean value to display oui ou non
 * @param {number} value - boolean value to filter
*/
export function yesNoFilter (value) {
  return value ? 'oui' : 'non'
}

const percentageFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'decimal',
  maximumFractionDigits: 2
})

/**
 * Filter a nullable value to display percentage by multiplying by 100 and
 * locale format with 2 digits after comma
 * @param {number} value - nullable value to filter
*/
export function percentage (value) {
  return typeof value === 'number'
    ? percentageFormatter.format(100 * value) + ' %'
    : '-'
}

/**
 * Return the substring if it's not longer than 70 characters and the first 50
 * ones with dots otherwise
 * @param {number} value - nullable string to truncate
*/
export function truncate (t) {
  if (t === null) return null
  const suffix = t.length > 70 ? ' ...' : ''
  return t.slice(0, 50) + suffix
}

/**
 * Format a nullable integer to display value or empty string when null
 * @param {number} value - nullable integer to format
*/
export function intFormat (value) {
  if (value === null) {
    return ''
  }
  return numberFormatter.format(value)
}

/**
 * Format a nullable integer to display value divided by 100 or empty string
 * when null
 * @param {number} value - nullable integer to format
*/
export function triFormat (value) {
  if (value === null) {
    return ''
  }
  return numberFormatter.format(0.01 * value)
}

/**
 * Format a nullable integer to display value multiplied by 100 or empty string
 * when null
 * @param {number} value - nullable integer to format
*/
export function percentageInput (value) {
  if (value === null) {
    return ''
  }
  return numberFormatter.format(100 * value)
}

/**
 * Parse a string to a percentage dividing by 100 and replacing comma by dot
 * Returns null if string if empty
 * @param {number} value - nullable integer to format
*/
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
