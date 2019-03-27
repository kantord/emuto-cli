const {expect, test} = require('@oclif/test')
const createEmutoCliCommand = require('../src/emuto')

const input1 = {
  foo: {
    n: 4,
  },
  bar: {
    hello: 'world',
  },
}

const input2 = {
  foo: {
    n: 6,
  },
  bar: {
    hello: 'world',
  },
}

const input4 = ['h']

const fakeGetStdin = fakeStdin => () => ({
  then: callback =>
    callback(fakeStdin === null ? '' : JSON.stringify(fakeStdin)),
})

const cmdWithInput1 = createEmutoCliCommand({
  getStdin: fakeGetStdin(input1),
})

const cmdWithInput2 = createEmutoCliCommand({
  getStdin: fakeGetStdin(input2),
})

const cmdWithInput3 = createEmutoCliCommand({
  getStdin: fakeGetStdin(null),
})

const cmdWithInput4 = createEmutoCliCommand({
  getStdin: fakeGetStdin(input4),
})

const cmdWithFakeFile = createEmutoCliCommand({
  fs: {
    readFileSync: fname =>
      ({
        'file1.json': '$.foo',
        'file2.json': '$.bar',
      }[fname]),
  },
  getStdin: fakeGetStdin(input1),
})

const cmdWithRawInput = createEmutoCliCommand({
  getStdin: () => ({
    then: callback =>
      callback(`hello
world
foobar`),
  }),
})

const cmdWithCSVInput = createEmutoCliCommand({
  getStdin: () => ({
    then: callback =>
      callback(`hello,1
world,2
foobar,5`),
  }),
})

const cmdWithCSVInputOmittedColumns = createEmutoCliCommand({
  getStdin: () => ({
    then: callback =>
      callback(`hello,1
world
`),
  }),
})

const cmdWithCSVHInput = createEmutoCliCommand({
  getStdin: () => ({
    then: callback =>
      callback(`name,age
john,2`),
  }),
})

const cmdWithCSVInput2 = createEmutoCliCommand({
  getStdin: () => ({
    then: callback =>
      callback(`hello,1
world,world
foobar,5`),
  }),
})

const cmdWithTSVInput = createEmutoCliCommand({
  getStdin: () => ({
    then: callback =>
      callback(`hello	1
world	2
foobar	5`),
  }),
})

const cmdWithDSVInput = createEmutoCliCommand({
  getStdin: () => ({
    then: callback =>
      callback(`hello61
world62
foobar65`),
  }),
})

const cmdWithDSVInput2 = createEmutoCliCommand({
  getStdin: () => ({
    then: callback =>
      callback(`hello81
world82
foobar85`),
  }),
})

const normalizeJSON = string => JSON.stringify(JSON.parse(string))

describe('emuto-cli', () => {
  test
  .stdout()
  .do(() => cmdWithInput1.run(['$.foo']))
  .it('runs emuto "$.foo"', ctx => {
    expect(normalizeJSON(ctx.stdout)).to.contain(JSON.stringify({n: 4}))
  })

  test
  .stdout()
  .do(() => cmdWithInput1.run(['$.bar']))
  .it('runs emuto "$.bar"', ctx => {
    expect(normalizeJSON(ctx.stdout)).to.contain(
      JSON.stringify({hello: 'world'})
    )
  })

  test
  .stdout()
  .do(() => cmdWithInput2.run(['$.foo']))
  .it('runs emuto "$.foo"', ctx => {
    expect(normalizeJSON(ctx.stdout)).to.contain(JSON.stringify({n: 6}))
  })

  test
  .stdout()
  .do(() => cmdWithInput2.run(['$.foo', '--ugly']))
  .it('runs emuto "$.foo"', ctx => {
    expect(ctx.stdout).to.contain(JSON.stringify({n: 6}))
  })

  test
  .stdout()
  .do(() => cmdWithInput2.run(['$.foo', '--color']))
  .it('runs emuto "$.foo"', ctx => {
    expect(normalizeJSON(ctx.stdout)).to.contain(JSON.stringify({n: 6}))
  })

  test
  .stdout()
  .do(() => cmdWithInput3.run(['[3, 4]']))
  .it('runs emuto "[3, 4]"', ctx => {
    expect(normalizeJSON(ctx.stdout)).to.contain([3, 4])
  })

  test
  .stdout()
  .do(() => cmdWithInput4.run([]))
  .it('runs emuto without filter', ctx => {
    expect(normalizeJSON(ctx.stdout)).to.contain(['h'])
  })

  test
  .stdout()
  .do(() => cmdWithFakeFile.run(['', '--script-file=file1.json']))
  .it('runs emuto "$.foo"', ctx => {
    expect(normalizeJSON(ctx.stdout)).to.contain(JSON.stringify({n: 4}))
  })

  test
  .stdout()
  .do(() => cmdWithFakeFile.run(['', '-s=file2.json']))
  .it('runs emuto "$.bar"', ctx => {
    expect(normalizeJSON(ctx.stdout)).to.contain(
      JSON.stringify({hello: 'world'})
    )
  })

  test
  .stdout()
  .do(() => cmdWithRawInput.run(['', '-i=raw']))
  .it('runs emuto "$"', ctx => {
    expect(normalizeJSON(ctx.stdout)).to.contain(
      JSON.stringify(['hello', 'world', 'foobar'])
    )
  })

  test
  .stdout()
  .do(() => cmdWithRawInput.run(['$[0]', '--input=raw']))
  .it('runs emuto "$[0]"', ctx => {
    expect(normalizeJSON(ctx.stdout)).to.contain(JSON.stringify('hello'))
  })

  test
  .stdout()
  .do(() => cmdWithCSVInput.run(['$[0]', '--input=csv']))
  .it('runs emuto "$[0]"', ctx => {
    expect(normalizeJSON(ctx.stdout)).to.contain(
      JSON.stringify(['hello', '1'])
    )
  })

  test
  .stdout()
  .do(() => cmdWithCSVInputOmittedColumns.run(['$[0]', '--input=csv']))
  .it('runs emuto "$[0]"', ctx => {
    expect(normalizeJSON(ctx.stdout)).to.contain(
      JSON.stringify(['hello', '1'])
    )
  })

  test
  .stdout()
  .do(() => cmdWithCSVHInput.run(['$[0]', '--input=csv', '-I=head']))
  .it('runs emuto "$[0]"', ctx => {
    expect(normalizeJSON(ctx.stdout)).to.contain(
      JSON.stringify({name: 'john', age: '2'})
    )
  })

  test
  .stdout()
  .do(() =>
    cmdWithCSVHInput.run(['$[0]', '--input=csv', '--input-feature=head'])
  )
  .it('runs emuto "$[0]"', ctx => {
    expect(normalizeJSON(ctx.stdout)).to.contain(
      JSON.stringify({name: 'john', age: '2'})
    )
  })

  test
  .stdout()
  .do(() => cmdWithCSVInput2.run(['$[1]', '--input=csv']))
  .it('runs emuto "$[1]"', ctx => {
    expect(normalizeJSON(ctx.stdout)).to.contain(
      JSON.stringify(['world', 'world'])
    )
  })

  test
  .stdout()
  .do(() => cmdWithTSVInput.run(['$', '--input=tsv']))
  .it('runs emuto "$"', ctx => {
    expect(normalizeJSON(ctx.stdout)).to.contain(
      JSON.stringify([['hello', '1'], ['world', '2'], ['foobar', '5']])
    )
  })

  test
  .stdout()
  .do(() => cmdWithDSVInput.run(['$', '--input=dsv', '-d=6']))
  .it('runs emuto "$"', ctx => {
    expect(normalizeJSON(ctx.stdout)).to.contain(
      JSON.stringify([['hello', '1'], ['world', '2'], ['foobar', '5']])
    )
  })

  test
  .stdout()
  .do(() => cmdWithDSVInput2.run(['$', '-i=dsv', '--input-delimiter=8']))
  .it('runs emuto "$"', ctx => {
    expect(normalizeJSON(ctx.stdout)).to.contain(
      JSON.stringify([['hello', '1'], ['world', '2'], ['foobar', '5']])
    )
  })

  test
  .stdout()
  .do(() => cmdWithRawInput.run(['$[0]', '--input=asfg']))
  .catch(/Input format 'asfg' is unkown/)
  .it('Throws error on unkown input format')

  test
  .stdout()
  .do(() => cmdWithRawInput.run(['$[0]', '--input=hello']))
  .catch(/Input format 'hello' is unkown/)
  .it('Throws error on unkown input format')

  test
  .stdout()
  .do(() => cmdWithRawInput.run(['', '-i=raw', '-o=raw']))
  .it('runs emuto "$"', ctx => {
    expect(ctx.stdout).to.contain(`hello
world
foobar`)
  })

  test
  .stdout()
  .do(() => cmdWithRawInput.run(['', '-i=raw', '--output=raw']))
  .it('runs emuto "$"', ctx => {
    expect(String(ctx.stdout)).to.contain('hello')
  })

  test
  .stdout()
  .do(() => cmdWithRawInput.run(['$[0]', '-i=raw', '--output=asfg']))
  .catch(/Output format 'asfg' is unkown/)
  .it('Throws error on unkown output format')

  test
  .stdout()
  .do(() => cmdWithRawInput.run(['$[0]', '-i=raw', '--output=foo']))
  .catch(/Output format 'foo' is unkown/)
  .it('Throws error on unkown output format')

  test
  .stdout()
  .do(() => cmdWithRawInput.run(['$[0]', '--input=csv', '-d=x']))
  .catch(/Input delimiter is only valid with dsv input format/)
  .it('Throws error when delimiter is used with wrong input format')

  test
  .stdout()
  .do(() => cmdWithRawInput.run(['$[0]', '--input=dsv']))
  .catch(/You have to specify a delimiter to use dsv input format/)
  .it('Throw error when required input delimiter is not provided')

  test
  .stdout()
  .do(() => cmdWithRawInput.run(['$[0]', '-i=raw', '-I=head']))
  .catch(/Header is only supported for csv, tsv, and dsv inputs/)
  .it('Throws error when trying to use header with incorrect input format')
})
