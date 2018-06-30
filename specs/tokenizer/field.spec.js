const tokenize = require('../../lib/parse_steps/tokenize.js');

const input = `
name: value

name:    value

name    : value

    name    :    value

name: value
`.trim();

describe('Field tokenization', () => {
  it('performs to specification', () => {
    const context = { input: input };

    tokenize(context);

    expect(context.instructions).toMatchSnapshot();
  });
});
