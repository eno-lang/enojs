const { inspectTokenization } = require('./util.js');

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
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
