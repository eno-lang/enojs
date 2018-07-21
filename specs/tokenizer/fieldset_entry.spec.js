const tokenize = require('../../lib/parse_steps/tokenize.js');

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
    const context = { input: input };

    tokenize(context);

    expect(context.instructions).toMatchSnapshot();
  });
});
