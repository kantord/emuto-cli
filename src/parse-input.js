const parseInput = (str, type, inputDelimiter, inputFeatures) => {
  const columns = inputFeatures.includes('head')

  if (!str) {
    return null
  }
  if (type === 'json') {
    return JSON.parse(str)
  }
  if (type === 'raw') {
    return str.split('\n')
  }

  if (type === 'csv') {
    return require('csv-parse/lib/sync')(str, {columns})
  }

  if (type === 'tsv') {
    return require('csv-parse/lib/sync')(str, {delimiter: '\t', columns})
  }

  if (type === 'dsv') {
    return require('csv-parse/lib/sync')(str, {
      delimiter: inputDelimiter,
      columns,
    })
  }

  throw new Error("Input format '" + type + "' is unkown")
}

module.exports = parseInput
