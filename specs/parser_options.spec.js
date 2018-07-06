const eno = require('../eno.js');

describe('Parser options', () => {
  describe('Non-string input', () => {
    it('throws an error', () => {
      expect(() => eno.parse({ foo: 'bar' })).toThrowErrorMatchingSnapshot();
    });
  });

  describe('Non-object options', () => {
    it('throws an error', () => {
      expect(() => eno.parse('', 'de')).toThrowErrorMatchingSnapshot();
    });
  });

  describe('Unsupported option', () => {
    it('throws an error', () => {
      expect(() => eno.parse('', { wishful: 'thinking' })).toThrowErrorMatchingSnapshot();
    });
  });

  describe('Unsupported locale', () => {
    it('throws an error', () => {
      expect(() => eno.parse('', { locale: 'abcdef' })).toThrowErrorMatchingSnapshot();
    });
  });

  describe('Unsupported reporter', () => {
    it('throws an error', () => {
      expect(() => eno.parse('', { reporter: 'television' })).toThrowErrorMatchingSnapshot();
    });
  });

  describe('sourceLabel', () => {
    it('is printed in text reports if provided', () => {
      expect(() => eno.parse('boom!', { sourceLabel: '/some/dubious-file.eno' })).toThrowErrorMatchingSnapshot();
    });

    it('is printed in html reports if provided', () => {
      expect(() => eno.parse('boom!', { reporter: 'html', sourceLabel: '/some/dubious-file.eno' })).toThrowErrorMatchingSnapshot();
    });

    it('is printed in terminal reports if provided', () => {
      expect(() => eno.parse('boom!', { reporter: 'terminal', sourceLabel: '/some/dubious-file.eno' })).toThrowErrorMatchingSnapshot();
    });
  });
});
