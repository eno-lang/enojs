const { parse } = require('../eno.js');

describe('Unicode special characters', () => {
  test('Line separator is handled correctly', () => {
    const doc = parse(`Unicode line separator: Here it comes   that was it`);
    const value = doc.field('Unicode line separator');
    
    expect(value).toEqual(`Here it comes   that was it`);
  });
});
