const { inspectTokenization } = require('./util.js');

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
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
