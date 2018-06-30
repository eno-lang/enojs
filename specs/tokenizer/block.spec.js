const tokenize = require('../../lib/parse_steps/tokenize.js');

const input = `
-- name
value
-- name

--    name

value

    -- name

    --    name
value

    value
        -- name
`.trim();

describe('Block tokenization', () => {
  it('performs to specification', () => {
    const context = { input: input };

    tokenize(context);

    expect(context.instructions).toMatchSnapshot();
  });
});
