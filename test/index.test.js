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

const fakeGetStdin = fakeStdin => () => ({
  then: callback => callback(JSON.stringify(fakeStdin)),
})

const cmdWithInput1 = createEmutoCliCommand({
  getStdin: fakeGetStdin(input1),
})

const cmdWithInput2 = createEmutoCliCommand({
  getStdin: fakeGetStdin(input2),
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
    expect(normalizeJSON(ctx.stdout)).to.contain(JSON.stringify({hello: 'world'}))
  })

  test
  .stdout()
  .do(() => cmdWithInput2.run(['$.foo']))
  .it('runs emuto "$.foo"', ctx => {
    expect(normalizeJSON(ctx.stdout)).to.contain(JSON.stringify({n: 6}))
  })

  test
  .stdout()
  .do(() => cmdWithInput2.run(['$.foo']))
  .it('runs emuto "$.foo"', ctx => {
    expect(ctx.stdout).to.contain('{ "n": 6 }\n')
  })
})
