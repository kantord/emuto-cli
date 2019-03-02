const beautify = require('json-beautify')
const emuto = require('node-emuto')

const createEmutoCliCommand = ({getStdin}) => {
  const {Command, flags} = require('@oclif/command')

  class EmutoCliCommand extends Command {
    async run() {
      const {args} = this.parse(EmutoCliCommand)
      const {filter} = args
      const compiledFilter = emuto(filter)
      getStdin().then(str => {
        const parsedInput = JSON.parse(str)
        this.log(beautify(compiledFilter(parsedInput), null, 2, 100))
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
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    // add --help flag to show CLI version
    help: flags.help({char: 'h'}),
  }

  return EmutoCliCommand
}

module.exports = createEmutoCliCommand
