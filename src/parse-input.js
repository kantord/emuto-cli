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
    return require('csv-parse/lib/sync')(str, {
      columns,
      relax_column_count: true, // eslint-disable-line camelcase
    })
  }

  if (type === 'tsv') {
    return require('csv-parse/lib/sync')(str, {
      delimiter: '\t',
      columns,
      relax_column_count: true, // eslint-disable-line camelcase
    })
  }

  if (type === 'dsv') {
    return require('csv-parse/lib/sync')(str, {
      delimiter: inputDelimiter,
      columns,
      relax_column_count: true, // eslint-disable-line camelcase
    })
  }

  throw new Error("Input format '" + type + "' is unkown")
}

module.exports = parseInput
