const { inspectTokenization } = require('./util.js');

const input = `
# name

    ## name

###    name

    ####    name

# name
`.trim();

describe('Section tokenization', () => {
  it('performs to specification', () => {
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
