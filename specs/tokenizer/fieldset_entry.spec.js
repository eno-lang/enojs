const { inspectTokenization } = require('./util.js');

const input = `
entry = value

entry    = value

    entry = value

    entry    = value

    entry    =    value

entry = value
`.trim();

describe('Fieldset entry tokenization', () => {
  it('performs to specification', () => {
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
