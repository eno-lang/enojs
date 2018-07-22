const { inspectTokenization } = require('./util.js');

const input = `
name: value

name:    value

name    : value

    name    :    value

name: value
`.trim();

describe('Field tokenization', () => {
  it('performs to specification', () => {
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
