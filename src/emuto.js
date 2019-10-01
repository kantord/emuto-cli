const emuto = require('node-emuto')
const validateFlags = require('./validate-flags.js')
const parseInput = require('./parse-input.js')
const serializer = require('./serializer.js')
const util = require('util')
const fs = require('fs')
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const createEmutoCliCommand = ({getStdin, fs}) => {
  const {Command, flags} = require('@oclif/command')

  class EmutoCliCommand extends Command {
    async emuto() {
      const {args, flags} = this.parse(EmutoCliCommand)
      const inputFeatures = flags['input-feature'] || []
      const fileToEditInplace = flags['edit-file'] || null
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

      const str = fileToEditInplace ?
        await readFile(fileToEditInplace) :
        await getStdin()
      const parsedInput = parseInput(
        str,
        input.toLowerCase(),
        inputDelimiter,
        inputFeatures
      )
      const results = compiledFilter(parsedInput)
      if (fileToEditInplace) {
        await writeFile(
          fileToEditInplace,
          serializer(results, output.toLowerCase(), ugly, color)
        )
      } else {
        this.log(serializer(results, output.toLowerCase(), ugly, color))
      }
    }

    async run() {
      try {
        await this.emuto()
      } catch (error) {
        this.error(error.message || error.toString())
      }
    }
  }

  EmutoCliCommand.args = [{name: 'filter', required: false}]

  EmutoCliCommand.description = `process JSON files

  Example:

    cat input.json | emuto '$.characters | map ($ => $ { name gender})'

The shebang for emuto is #! emuto -s

wsp format: 	lines with columns separated by whitespace.
		Empty columns are not supported.
`

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
    'edit-file': flags.string({
      char: 'e',
      description: 'edit a file in place',
    }),
  }

  return EmutoCliCommand
}

module.exports = createEmutoCliCommand
