const tokenize = require('../../lib/parse_steps/tokenize.js');

const input = `
name < template
name << template
name    < template
name    << template
     name     < template
     name     << template
`.trim();

describe('Copy tokenization', () => {
  it('performs to specification', () => {
    const context = { input: input };

    tokenize(context);

    expect(context.instructions).toMatchSnapshot();
  });
});
