const eno = require('enojs');
const { loaders } = require('enojs');

describe('color', () => {

  let document;

  describe('#abcdef', () => {
    it("returns '#abcdef'", () => {
      document = eno.parse('color: #abcdef');
      expect(document.field('color', loaders.color)).toEqual('#abcdef');
    });
  });

  describe('#ABCDEF', () => {
    it("returns '#ABCDEF'", () => {
      document = eno.parse('color: #ABCDEF');
      expect(document.field('color', loaders.color)).toEqual('#ABCDEF');
    });
  });

  describe('#012345', () => {
    it("returns '#012345'", () => {
      document = eno.parse('color: #012345');
      expect(document.field('color', loaders.color)).toEqual('#012345');
    });
  });

  describe('#678', () => {
    it("returns '#678'", () => {
      document = eno.parse('color: #678');
      expect(document.field('color', loaders.color)).toEqual('#678');
    });
  });

  describe('#89a', () => {
    it("returns '#89a'", () => {
      document = eno.parse('color: #89a');
      expect(document.field('color', loaders.color)).toEqual('#89a');
    });
  });

  describe('#ab', () => {
    it('throws an error', () => {
      document = eno.parse('color: #ab');
      expect(() => document.field('color', loaders.color)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('#abcd', () => {
    it('throws an error', () => {
      document = eno.parse('color: #abcd');
      expect(() => document.field('color', loaders.color)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('#abcde', () => {
    it('throws an error', () => {
      document = eno.parse('color: #abcde');
      expect(() => document.field('color', loaders.color)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('#bcdefg', () => {
    it('throws an error', () => {
      document = eno.parse('color: #bcdefg');
      expect(() => document.field('color', loaders.color)).toThrowErrorMatchingSnapshot();
    });
  });
});
