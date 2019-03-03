const beautify = require('json-beautify')
const emuto = require('node-emuto')
const highlight = require('highlight-es')

const createEmutoCliCommand = ({getStdin}) => {
  const {Command, flags} = require('@oclif/command')

  class EmutoCliCommand extends Command {
    async run() {
      const {args, flags} = this.parse(EmutoCliCommand)
      const {filter} = args
      const {ugly, color} = flags
      const compiledFilter = emuto(filter || '$')
      const serializer = ugly ? JSON.stringify : obj => beautify(obj, null, 2, process.stdout.columns)
      getStdin().then(str => {
        const parsedInput = str ? JSON.parse(str) : null
        const results = compiledFilter(parsedInput)
        const serializedOutput = serializer(results)
        this.log(color ? highlight(serializedOutput) : serializedOutput)
      })
    }
  }

  EmutoCliCommand.args = [
    {name: 'filter', required: false},
  ]

  EmutoCliCommand.description = `Describe the command here
    ...
    Extra documentation goes here
    `

  EmutoCliCommand.flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    ugly: flags.boolean({char: 'u', description: "Don't prettify output"}),
    color: flags.boolean({char: 'c', description: 'Color output'}),
  }

  return EmutoCliCommand
}

module.exports = createEmutoCliCommand
