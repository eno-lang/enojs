const eno = require('enojs');
const { loaders } = require('enojs');

describe('commaSeparated', () => {
  describe('one,two,three', () => {
    it('splits by comma', () => {
      const document = eno.parse('value: one,two,three');
      expect(document.field('value', loaders.commaSeparated)).toEqual(['one', 'two', 'three']);
    });
  });

  describe('one , two , three', () => {
    it('splits by comma and trims the values', () => {
      const document = eno.parse('value: one , two , three');
      expect(document.field('value', loaders.commaSeparated)).toEqual(['one', 'two', 'three']);
    });
  });

  describe(',,', () => {
    it('splits by comma and retains empty values', () => {
      const document = eno.parse('value: ,,');
      expect(document.field('value', loaders.commaSeparated)).toEqual(['', '', '']);
    });
  });

  describe('one two three', () => {
    it('returns the value unaltered as a single array item', () => {
      const document = eno.parse('value: one two three');
      expect(document.field('value', loaders.commaSeparated)).toEqual(['one two three']);
    });
  });

  describe('one;two;three', () => {
    it('returns the value unaltered as a single array item', () => {
      const document = eno.parse('value: one;two;three');
      expect(document.field('value', loaders.commaSeparated)).toEqual(['one;two;three']);
    });
  });
});
