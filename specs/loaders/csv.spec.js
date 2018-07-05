const eno = require('enojs');
const { loaders } = require('enojs');

describe('csv', () => {
  describe('one,two,three', () => {
    it('splits by comma', () => {
      const document = eno.parse('csv: one,two,three');
      expect(document.field('csv', loaders.csv)).toEqual(['one', 'two', 'three']);
    });
  });

  describe('one , two , three', () => {
    it('splits by comma and trims the values', () => {
      const document = eno.parse('csv: one , two , three');
      expect(document.field('csv', loaders.csv)).toEqual(['one', 'two', 'three']);
    });
  });

  describe(',,', () => {
    it('splits by comma and retains empty values', () => {
      const document = eno.parse('csv: ,,');
      expect(document.field('csv', loaders.csv)).toEqual(['', '', '']);
    });
  });

  describe('one two three', () => {
    it('returns the value unaltered as a single array item', () => {
      const document = eno.parse('csv: one two three');
      expect(document.field('csv', loaders.csv)).toEqual(['one two three']);
    });
  });

  describe('one;two;three', () => {
    it('returns the value unaltered as a single array item', () => {
      const document = eno.parse('csv: one;two;three');
      expect(document.field('csv', loaders.csv)).toEqual(['one;two;three']);
    });
  });
});
