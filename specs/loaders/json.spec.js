const eno = require('enojs');
const { loaders } = require('enojs');

describe('json', () => {

  let document;

  describe('{ "valid": true }', () => {
    it('returns { "valid": true }', () => {
      document = eno.parse('json: { "valid": true }');
      expect(document.field('json', loaders.json)).toEqual({ valid: true });
    });
  });

  describe('42', () => {
    it('returns 42', () => {
      document = eno.parse('json: 42');
      expect(document.field('json', loaders.json)).toBe(42);
    });
  });

  describe('["valid", true]', () => {
    it('returns ["valid", true]', () => {
      document = eno.parse('json: ["valid", true]');
      expect(document.field('json', loaders.json)).toEqual(['valid', true]);
    });
  });

  describe('invalid', () => {
    it('throws an error', () => {
      document = eno.parse('json: invalid');
      expect(() => document.field('json', loaders.json)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('{ invalid: true }', () => {
    it('throws an error', () => {
      document = eno.parse('json: { invalid: true }');
      expect(() => document.field('json', loaders.json)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('{ "invalid": true, }', () => {
    it('throws an error', () => {
      document = eno.parse('json: { "invalid": true, }');
      expect(() => document.field('json', loaders.json)).toThrowErrorMatchingSnapshot();
    });
  });
});
