const validateFlags = flags => {
  const asksForHeader = (flags['input-feature'] || []).includes('head')
  const supportsHeader = ['csv', 'dsv', 'tsv'].includes(flags.input)

  if (flags.input === 'dsv' && !flags['input-delimiter']) {
    throw new Error('You have to specify a delimiter to use dsv input format')
  }

  if (flags.input !== 'dsv' && flags['input-delimiter']) {
    throw new Error('Input delimiter is only valid with dsv input format')
  }

  if (asksForHeader && !supportsHeader) {
    throw new Error('Header is only supported for csv, tsv, and dsv inputs')
  }
}

module.exports = validateFlags
