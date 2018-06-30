const tokenize = require('../../lib/parse_steps/tokenize.js');

let input = '\n' +
            ' \n' +
            '  \n' +
            '   \n' +
            '\n' +
            ' \n' +
            '  \n' +
            '   \n';

describe('Empty line tokenization', () => {
  it('performs to specification', () => {
    const context = { input: input };

    tokenize(context);

    expect(context.instructions).toMatchSnapshot();
  });
});
