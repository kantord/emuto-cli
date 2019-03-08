const beautify = require('json-beautify')
const emuto = require('node-emuto')
const highlight = require('highlight-es')

const createEmutoCliCommand = ({getStdin, fs}) => {
  const {Command, flags} = require('@oclif/command')

  class EmutoCliCommand extends Command {
    async run() {
      const {args, flags} = this.parse(EmutoCliCommand)
      const {filter} = args
      const {ugly, color} = flags
      const scriptFile = flags['script-file']
      const inputFromFile = scriptFile ? fs.readFileSync(scriptFile, 'utf8') : null
      const filterSource = inputFromFile || filter || '$'
      const compiledFilter = emuto(filterSource)
      const serializer = ugly ?
        JSON.stringify :
        obj => beautify(obj, null, 2, process.stdout.columns)
      getStdin().then(str => {
        const parsedInput = str ? JSON.parse(str) : null
        const results = compiledFilter(parsedInput)
        const serializedOutput = serializer(results)
        this.log(color ? highlight(serializedOutput) : serializedOutput)
      })
    }
  }

  EmutoCliCommand.args = [{name: 'filter', required: false}]

  EmutoCliCommand.description = 'process JSON files'

  EmutoCliCommand.flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    ugly: flags.boolean({char: 'u', description: "don't prettify output"}),
    color: flags.boolean({char: 'c', description: 'color output'}),
    'script-file': flags.string({char: 's', description: 'read script from file'}),
  }

  return EmutoCliCommand
}

module.exports = createEmutoCliCommand
