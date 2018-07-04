const eno = require('enojs');
const { loaders } = require('enojs');

describe('integer', () => {

  let document;

  describe('42', () => {
    it('returns 42', () => {
      document = eno.parse('integer: 42');
      expect(document.field('integer', loaders.integer)).toBe(42);
    });
  });

  describe('-42', () => {
    it('returns -42', () => {
      document = eno.parse('integer: -42');
      expect(document.field('integer', loaders.integer)).toBe(-42);
    });
  });

  describe('42.0', () => {
    it('throws an error', () => {
      document = eno.parse('integer: 42.0');
      expect(() => document.field('integer', loaders.integer)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('42,0', () => {
    it('throws an error', () => {
      document = eno.parse('integer: 42,0');
      expect(() => document.field('integer', loaders.integer)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('4 2', () => {
    it('throws an error', () => {
      document = eno.parse('integer: 4 2');
      expect(() => document.field('integer', loaders.integer)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('fortytwo', () => {
    it('throws an error', () => {
      document = eno.parse('integer: fortytwo');
      expect(() => document.field('integer', loaders.integer)).toThrowErrorMatchingSnapshot();
    });
  });
});
