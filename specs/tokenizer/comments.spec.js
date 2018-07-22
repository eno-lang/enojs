const { inspectTokenization } = require('./util.js');

const input = `
> note
> more notes
    >    note
    >
`.trim();

describe('Comment tokenization', () => {
  it('performs to specification', () => {
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
