const tokenize = require('../../lib/parse_steps/tokenize.js');

const input = `
| value

|    value

    | value

    |    value

| value
`.trim();

describe('Newline continutation tokenization', () => {
  it('performs to specification', () => {
    const context = { input: input };

    tokenize(context);

    expect(context.instructions).toMatchSnapshot();
  });
});
