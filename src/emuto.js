const beautify = require('json-beautify')
const emuto = require('node-emuto')

const createEmutoCliCommand = ({getStdin}) => {
  const {Command, flags} = require('@oclif/command')

  class EmutoCliCommand extends Command {
    async run() {
      const {args, flags} = this.parse(EmutoCliCommand)
      const {filter} = args
      const {ugly} = flags
      const compiledFilter = emuto(filter)
      const serializer = ugly ? JSON.stringify : obj => beautify(obj, null, 2, 100)
      getStdin().then(str => {
        const parsedInput = str ? JSON.parse(str) : null
        const results = compiledFilter(parsedInput)
        this.log(serializer(results))
      })
    }
  }

  EmutoCliCommand.args = [
    {name: 'filter', required: true},
  ]

  EmutoCliCommand.description = `Describe the command here
    ...
    Extra documentation goes here
    `

  EmutoCliCommand.flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    ugly: flags.boolean({char: 'u', description: "Don't prettify output"}),
  }

  return EmutoCliCommand
}

module.exports = createEmutoCliCommand
