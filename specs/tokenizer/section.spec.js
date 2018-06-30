const tokenize = require('../../lib/parse_steps/tokenize.js');

const input = `
# name

    ## name

###    name

    ####    name

# name
`.trim();

describe('Section tokenization', () => {
  it('performs to specification', () => {
    const context = { input: input };

    tokenize(context);

    expect(context.instructions).toMatchSnapshot();
  });
});
