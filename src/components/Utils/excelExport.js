import * as XlsxPopulate from 'xlsx-populate/browser/xlsx-populate-no-encryption'

const blueStyle = {
  fill: { type: 'solid', color: '1F497D' },
  fontColor: 'FFFFFF'
}

function parseData (datas, keys) {
  const lineNumber = datas.length
  let i = 1
  const parsed = []
  while (i < lineNumber && datas[i][0]._value) {
    const item = {}
    keys.forEach((k, j) => {
      item[k] = datas[i][j]._value
    })
    parsed.push(item)
    i++
  }
  return parsed
}

function fetchKeys (datas, expectedHeaders) {
  const keys = datas[0].map(d => d._value)
  if (expectedHeaders.some(e => !keys.includes(e))) {
    throw new Error(
      `Format de fichier incorrect : champ ${expectedHeaders} obligatoire absent`
    )
  }
  return keys
}

export const val2F = v => v ? v * 0.01 : 0

export const valStyle = {
  width: 14,
  style: { numberFormat: '#,##0.00' },
  addTotal: true
}

export const percentStyle = {
  width: 8,
  style: { numberFormat: '0.00 %' },
  addTotal: true
}

export const dateStyle = {
  width: 12,
  style: { numberFormat: 'dd/mm/yyyy' }
}

export function excelUploadFile (
  file,
  expectedHeaders,
  successCallback,
  errorCallback,
  parseCallback = null
) {
  try {
    XlsxPopulate.fromDataAsync(file).then(workbook => {
      const datas = workbook
        .sheet(0)
        .usedRange()
        .cells()
      const keys = fetchKeys(datas, expectedHeaders)
      let parsed = parseData(datas, keys)
      if (typeof parseCallback === 'function') {
        parsed = parseCallback(parsed)
      }
      if (typeof successCallback === 'function') {
        successCallback(parsed)
      }
    })
  } catch (e) {
    if (typeof errorCallback === 'function') {
      errorCallback(
        e instanceof Error ? e.message : 'Impossible de lire le fichier'
      )
    }
  }
}

function fileSave (blob, name) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.href = url
  a.download = name
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export function getExcelColumnName (i) {
  const firstChar = i > 25 ? String.fromCharCode(65 + (i - 25) / 26) : ''
  const secondChar = String.fromCharCode(65 + (i % 26))

  return firstChar + secondChar
}

function generateFileName (name) {
  const now = new Date()
  const f = x => String(x).padStart(2, '0')
  const dateTimePrefix =
    now.getFullYear() +
    f(now.getMonth() + 1) +
    f(now.getDate()) +
    '_' +
    f(now.getHours()) +
    f(now.getMinutes()) +
    f(now.getSeconds())

  return `${dateTimePrefix}${name}.xlsx`
}

function setColumnHeaders (columns, firstRow, workbook) {
  columns.forEach((col, i) => {
    firstRow
      .cell(i + 1)
      .value(col.header)
      .style({ ...blueStyle, horizontalAlignment: 'center' })
    const column = workbook.sheet(0).column(i + 1)
    column.width(col.width)
    if (col.style) column.style(col.style)
  })
}

function fillCells (jsonObject, workbook, firstRowNumber, columns) {
  jsonObject.forEach((o, i) => {
    const row = workbook.sheet(0).row(i + firstRowNumber)
    columns.forEach((c, j) => {
      if (Object.hasOwnProperty.call(c, 'formula')) {
        const formula = c.formula.replace(/£/g, i + firstRowNumber)
        row.cell(j + 1).formula(formula)
      } else {
        const key = c.key
        row.cell(j + 1).value(o[key] === null ? '' : o[key])
      }
    })
  })
}

function setTotalCells (workbook, filterLastRow, columns) {
  const firstRow = workbook.sheet(0).row(1)
  const lastRow = workbook.sheet(0).row(filterLastRow + 1)

  if (!Object.hasOwnProperty.call(columns[0], 'addTotal')) {
    firstRow.cell(1).value('Total')
    lastRow.cell(1).value('Total')
  }

  columns.forEach((c, i) => {
    firstRow.cell(i + 1).style(blueStyle)
    lastRow.cell(i + 1).style(blueStyle)
    if (Object.hasOwnProperty.call(c, 'addTotal')) {
      const column = getExcelColumnName(i)
      const formula = `SUBTOTAL(9,${column}3:${column}${filterLastRow})`
      firstRow.cell(i + 1).formula(formula)
      lastRow.cell(i + 1).formula(formula)
    }
  })
}

export function excelExport (jsonObject, columns, name) {
  XlsxPopulate.fromBlankAsync().then(workbook => {
    const addTotal = columns.some(c => Object.hasOwnProperty.call(c, 'addTotal'))
    const firstRowNumber = addTotal ? 3 : 2
    const firstRow = addTotal
      ? workbook.sheet(0).row(2)
      : workbook.sheet(0).row(1)
    const colLength = columns.length

    setColumnHeaders(columns, firstRow, workbook)

    fillCells(jsonObject, workbook, firstRowNumber, columns)

    if (colLength > 0) {
      const filterFirstRow = firstRowNumber - 1
      const filterLastRow = filterFirstRow + jsonObject.length
      const filterLastColumnName = getExcelColumnName(colLength - 1)
      workbook
        .sheet(0)
        .range(`A${filterFirstRow}:${filterLastColumnName}${filterLastRow}`)
        .autoFilter()

      if (addTotal) setTotalCells(workbook, filterLastRow, columns)
    }
    workbook.outputAsync().then(blob => {
      fileSave(blob, generateFileName(name))
    })
  })
}
