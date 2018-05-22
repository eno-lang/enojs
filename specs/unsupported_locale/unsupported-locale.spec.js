const { parse } = require('../../eno.js');

describe('Unsupported locale', () => {
  test('throws', () => {
    expect(() => parse('', 'abcdef')).toThrowErrorMatchingSnapshot();
  });
});
