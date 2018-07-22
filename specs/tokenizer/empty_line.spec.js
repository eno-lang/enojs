const { inspectTokenization } = require('./util.js');

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
    expect(inspectTokenization(input)).toMatchSnapshot();
  });

  describe('Zero-length input', () => {
    it('performs to specification', () => {
      expect(inspectTokenization('')).toMatchSnapshot();
    });
  })
});
