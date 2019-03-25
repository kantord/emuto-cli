const highlight = require('highlight-es')
const beautify = require('json-beautify')

const serializeToJSON = (output, format, ugly, color) => {
  const serializer = ugly ?
    JSON.stringify :
    obj => beautify(obj, null, 2, process.stdout.columns)
  const serializedOutput = serializer(output)
  return color ? highlight(serializedOutput) : serializedOutput
}

const serializeToRaw = output => output.join('\n')

const serializer = (output, format, ugly, color) => {
  if (format === 'json') {
    return serializeToJSON(output, format, ugly, color)
  }
  if (format === 'raw') {
    return serializeToRaw(output)
  }

  throw new Error("Output format '" + format + "' is unkown")
}

module.exports = serializer
