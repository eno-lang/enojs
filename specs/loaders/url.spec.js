const eno = require('enojs');
const { loaders } = require('enojs');

describe('url', () => {

  let document;

  describe('http://valid.com', () => {
    it('returns the url', () => {
      document = eno.parse('url: http://valid.com');
      expect(document.field('url', loaders.url)).toBe('http://valid.com');
    });
  });

  describe('http://www.valid.com', () => {
    it('returns the url', () => {
      document = eno.parse('url: http://www.valid.com');
      expect(document.field('url', loaders.url)).toBe('http://www.valid.com');
    });
  });

  describe('https://valid.com', () => {
    it('returns the url', () => {
      document = eno.parse('url: https://valid.com');
      expect(document.field('url', loaders.url)).toBe('https://valid.com');
    });
  });

  describe('https://www.valid.com', () => {
    it('returns the url', () => {
      document = eno.parse('url: https://www.valid.com');
      expect(document.field('url', loaders.url)).toBe('https://www.valid.com');
    });
  });

  describe('invalid', () => {
    it('throws an error', () => {
      document = eno.parse('url: invalid');
      expect(() => document.field('url', loaders.url)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('www.invalid', () => {
    it('throws an error', () => {
      document = eno.parse('url: www.invalid');
      expect(() => document.field('url', loaders.url)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('www.invalid.com', () => {
    it('throws an error', () => {
      document = eno.parse('url: www.invalid.com');
      expect(() => document.field('url', loaders.url)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('htp://www.invalid.com', () => {
    it('throws an error', () => {
      document = eno.parse('url: htp://www.invalid.com');
      expect(() => document.field('url', loaders.url)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('http:/invalid.com', () => {
    it('throws an error', () => {
      document = eno.parse('url: http:/invalid.com');
      expect(() => document.field('url', loaders.url)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('https//invalid.com', () => {
    it('throws an error', () => {
      document = eno.parse('url: https//invalid.com');
      expect(() => document.field('url', loaders.url)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('https://invalid', () => {
    it('throws an error', () => {
      document = eno.parse('url: https://invalid');
      expect(() => document.field('url', loaders.url)).toThrowErrorMatchingSnapshot();
    });
  });
});
