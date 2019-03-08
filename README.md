emuto-cli
=========

JSON processor - transform and query JSON files using the emuto language

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/emuto-cli.svg)](https://npmjs.org/package/emuto-cli)
[![Downloads/week](https://img.shields.io/npm/dw/emuto-cli.svg)](https://npmjs.org/package/emuto-cli)
[![License](https://img.shields.io/npm/l/emuto-cli.svg)](https://github.com/kantord/emuto-cli/blob/master/package.json)

<!-- toc -->
# Usage

<pre>
USAGE
  $ emuto [FILTER]

OPTIONS
  -c, --color                    color output
  -h, --help                     show CLI help
  -s, --script-file=script-file  read script from file
  -u, --ugly                     don't prettify output
  -v, --version                  show CLI version

DESCRIPTION
  Example:

       cat input.json | emuto '$.characters | map ($ => $ { name gender})'

  The shebang for emuto is #! emuto -s
</pre>

# Setup

```
npm install -g emuto emuto-cli
```
