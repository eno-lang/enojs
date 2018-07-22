const { inspectTokenization } = require('./util.js');

const input = `
name:

name:

name    :

    name    :

name:
`.trim();

describe('Name tokenization', () => {
  it('performs to specification', () => {
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
