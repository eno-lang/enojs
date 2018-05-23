const eno = require('../eno.js');

describe('Parser options', () => {

  describe('Non-string input', () => {
    test('throws an error', () => {
      expect(() => eno.parse({ foo: 'bar' })).toThrowErrorMatchingSnapshot();
    });
  });

  describe('Non-object options', () => {
    test('throws an error', () => {
      expect(() => eno.parse('', 'de')).toThrowErrorMatchingSnapshot();
    });
  });

  describe('Unsupported option', () => {
    test('throws an error', () => {
      expect(() => eno.parse('', { wishful: 'thinking' })).toThrowErrorMatchingSnapshot();
    });
  });

  describe('Unsupported locale', () => {
    test('throws an error', () => {
      expect(() => eno.parse('', { locale: 'abcdef' })).toThrowErrorMatchingSnapshot();
    });
  });

  describe('Unsupported reporter', () => {
    test('throws an error', () => {
      expect(() => eno.parse('', { reporter: 'television' })).toThrowErrorMatchingSnapshot();
    });
  });

  describe('sourceLabel', () => {
    
    test('is printed in text reports if provided', () => {
      expect(() => eno.parse('boom!', { sourceLabel: '/some/dubious-file.eno' })).toThrowErrorMatchingSnapshot();
    });

    test('is printed in html reports if provided', () => {
      expect(() => eno.parse('boom!', { reporter: 'html', sourceLabel: '/some/dubious-file.eno' })).toThrowErrorMatchingSnapshot();
    });

    test('is printed in terminal reports if provided', () => {
      expect(() => eno.parse('boom!', { reporter: 'terminal', sourceLabel: '/some/dubious-file.eno' })).toThrowErrorMatchingSnapshot();
    });

  });
});
