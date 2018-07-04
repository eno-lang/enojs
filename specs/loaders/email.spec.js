const eno = require('enojs');
const { loaders } = require('enojs');

describe('email', () => {

  let document;

  describe('john.doe@eno-lang.org', () => {
    it('returns the email', () => {
      document = eno.parse('email: john.doe@eno-lang.org');
      expect(document.field('email', loaders.email)).toBe('john.doe@eno-lang.org');
    });
  });

  describe('john.doe@eno-lang', () => {
    it('throws an error', () => {
      document = eno.parse('email: john.doe@eno-lang');
      expect(() => document.field('email', loaders.email)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('@eno-lang.org', () => {
    it('throws an error', () => {
      document = eno.parse('email: @eno-lang.org');
      expect(() => document.field('email', loaders.email)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('john.doe@.org', () => {
    it('throws an error', () => {
      document = eno.parse('email: john.doe@.org');
      expect(() => document.field('email', loaders.email)).toThrowErrorMatchingSnapshot();
    });
  });
});
