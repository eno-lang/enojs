const { inspectTokenization } = require('./util.js');

const input = `
\\ value

\\    value

    \\ value

    \\    value

\\ value
`.trim();

describe('Line continutation tokenization', () => {
  it('performs to specification', () => {
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
