const beautify = require('json-beautify')
const emuto = require('node-emuto')
const highlight = require('highlight-es')
const validateFlags = require('./validate-flags.js')

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

const createEmutoCliCommand = ({getStdin, fs}) => {
  const {Command, flags} = require('@oclif/command')

  class EmutoCliCommand extends Command {
    async run() {
      const {args, flags} = this.parse(EmutoCliCommand)
      const inputFeatures = flags['input-feature'] || []
      validateFlags(flags)

      const {filter} = args
      const {ugly, color, input, output} = flags
      const inputDelimiter = flags['input-delimiter']
      const scriptFile = flags['script-file']
      const inputFromFile = scriptFile ?
        fs.readFileSync(scriptFile, 'utf8') :
        null
      const filterSource = inputFromFile || filter || '$'
      const compiledFilter = emuto(filterSource)

      getStdin().then(str => {
        const parsedInput = parseInput(
          str,
          input.toLowerCase(),
          inputDelimiter,
          inputFeatures
        )
        const results = compiledFilter(parsedInput)
        this.log(serializer(results, output.toLowerCase(), ugly, color))
      })
    }
  }

  EmutoCliCommand.args = [{name: 'filter', required: false}]

  EmutoCliCommand.description = `process JSON files

  Example:

    cat input.json | emuto '$.characters | map ($ => $ { name gender})'

The shebang for emuto is #! emuto -s`

  EmutoCliCommand.flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    ugly: flags.boolean({char: 'u', description: "don't prettify output"}),
    color: flags.boolean({char: 'c', description: 'color output'}),
    'script-file': flags.string({
      char: 's',
      description: 'read script from file',
    }),
    input: flags.string({
      char: 'i',
      description: 'input format. Valid: json, raw, csv, tsv, dsv',
      default: 'json',
    }),
    'input-delimiter': flags.string({
      char: 'd',
      description: 'delimiter for dsv input',
    }),
    output: flags.string({
      char: 'o',
      description: 'output format. Valid: json, raw',
      default: 'json',
    }),
    'input-feature': flags.string({
      char: 'I',
      description: 'special features for the input format',
      options: ['head'],
      multiple: true,
    }),
  }

  return EmutoCliCommand
}

module.exports = createEmutoCliCommand
