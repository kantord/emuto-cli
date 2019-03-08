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
    expect(normalizeJSON(ctx.stdout)).to.contain(JSON.stringify({hello: 'world'}))
  })
})
