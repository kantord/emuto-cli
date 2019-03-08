const cliCommand = require('./emuto')
const getStdin = require('get-stdin')
const fs = require('fs')

module.exports = cliCommand({getStdin, fs})
