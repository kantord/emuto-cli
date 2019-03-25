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
  -I, --input-feature=head               special features for the input format
  -c, --color                            color output
  -d, --input-delimiter=input-delimiter  delimiter for dsv input
  -h, --help                             show CLI help

  -i, --input=input                      [default: json] input format. Valid: json, raw, 
                                         csv, tsv, dsv

  -o, --output=output                    [default: json] output format. Valid: json, raw

  -s, --script-file=script-file          read script from file

  -u, --ugly                             don't prettify output

  -v, --version                          show CLI version

DESCRIPTION
  Example:

       cat input.json | emuto '$.characters | map ($ => $ { name gender})'

  The shebang for emuto is #! emuto -s
</pre>

# Setup

```
npm install -g emuto emuto-cli
```
