const eno = require('enojs');
const { loaders } = require('enojs');

describe('float', () => {

  let document;

  describe('42', () => {
    it('returns 42.0', () => {
      document = eno.parse('float: 42');
      expect(document.field('float', loaders.float)).toBe(42.0);
    });
  });

  describe('-42', () => {
    it('returns -42.0', () => {
      document = eno.parse('float: -42');
      expect(document.field('float', loaders.float)).toBe(-42.0);
    });
  });

  describe('42.0', () => {
    it('returns 42.0', () => {
      document = eno.parse('float: 42.0');
      expect(document.field('float', loaders.float)).toBe(42.0);
    });
  });

  describe('42,0', () => {
    it('throws an error', () => {
      document = eno.parse('float: 42,0');
      expect(() => document.field('float', loaders.float)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('4 2.0', () => {
    it('throws an error', () => {
      document = eno.parse('float: 4 2.0');
      expect(() => document.field('float', loaders.float)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('fortytwo dot zero', () => {
    it('throws an error', () => {
      document = eno.parse('float: fortytwo dot zero');
      expect(() => document.field('float', loaders.float)).toThrowErrorMatchingSnapshot();
    });
  });
});
