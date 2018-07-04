const eno = require('enojs');
const { loaders } = require('enojs');

describe('boolean', () => {

  let document;

  describe('true/false', () => {
    it("converts 'true' to true", () => {
      document = eno.parse('boolean: true');
      expect(document.field('boolean', loaders.boolean)).toBe(true);
    });

    it("converts 'false' to false", () => {
      document = eno.parse('boolean: false');
      expect(document.field('boolean', loaders.boolean)).toBe(false);
    });
  });

  describe('yes/no', () => {
    it("converts 'yes' to true", () => {
      document = eno.parse('boolean: yes');
      expect(document.field('boolean', loaders.boolean)).toBe(true);
    });

    it("converts 'no' to false", () => {
      document = eno.parse('boolean: no');
      expect(document.field('boolean', loaders.boolean)).toBe(false);
    });
  });

  describe('sicher', () => {
    it("throws an error", () => {
      document = eno.parse('boolean: sicher');
      expect(() => document.field('boolean', loaders.boolean)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('yes yes', () => {
    it("throws an error", () => {
      document = eno.parse('boolean: yes yes');
      expect(() => document.field('boolean', loaders.boolean)).toThrowErrorMatchingSnapshot();
    });
  });
});
