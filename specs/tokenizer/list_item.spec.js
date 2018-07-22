const { inspectTokenization } = require('./util.js');

const input = `
- value

-    value

    - value

    -    value

- value
`.trim();

describe('List item tokenization', () => {
  it('performs to specification', () => {
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
