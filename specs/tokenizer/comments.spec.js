const tokenize = require('../../lib/parse_steps/tokenize.js');

const input = `
> note
> more notes
    >    note
    >
`.trim();

describe('Comment tokenization', () => {
  it('performs to specification', () => {
    const context = { input: input };

    tokenize(context);

    expect(context.instructions).toMatchSnapshot();
  });
});
