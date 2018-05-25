const eno = require('../eno.js');

describe('Property issues', () => {
  describe('EnoSection', () => {
    describe('toString as field name', () => {
      test('does not have any side effects', () => {
        const document = eno.parse('toString: ok');

        expect(document.raw()).toEqual([{ toString: 'ok' }]);
      });
    });

    describe('toString as dictionary name', () => {
      test('does not have any side effects', () => {
        const document = eno.parse(`
          toString:
          check = ok
        `);

        expect(document.raw()).toEqual([{ toString: { check: 'ok' } }]);
      });
    });

    describe('toString as dictionary entry', () => {
      test('does not have any side effects', () => {
        const document = eno.parse(`
          check:
          toString = ok
        `);

        expect(document.raw()).toEqual([{ check: { toString: 'ok' } }]);
      });
    });

    describe('toString as missing template', () => {
      test('does not have any side effects', () => {
        expect(() => eno.parse('check < toString')).toThrowErrorMatchingSnapshot();
      });
    });

    describe('toString as name in a complex merge', () => {
      test('does not have any side effects', () => {
        const document = eno.parse(`
          # a
          ## toString
          toString:
          toString = check

          # b < a
          ## toString
          toString: ok

          # c << a
          ## toString
          toString:
          check = ok
        `);

        expect(document.raw()).toMatchSnapshot();
      });
    });

    describe('fetching from a missing toString field', () => {
      test('does not have any side effects', () => {
        const document = eno.parse('');

        expect(document.field('toString')).toBe(null);
      });
    });

    describe('fetching a missing dictionary named toString', () => {
      test('does not have any side effects', () => {
        const document = eno.parse('');

        expect(() => document.dictionary('toString')).toThrowErrorMatchingSnapshot();
      });
    });

    describe('fetching a missing list named toString', () => {
      test('does not have any side effects', () => {
        const document = eno.parse('');

        expect(document.list('toString')).toEqual([]);
      });
    });

    describe('fetching a missing section named toString', () => {
      test('does not have any side effects', () => {
        const document = eno.parse('');

        expect(() => document.section('toString')).toThrowErrorMatchingSnapshot();
      });
    });

    describe('fetching missing sections named toString', () => {
      test('does not have any side effects', () => {
        const document = eno.parse('');

        expect(document.sections('toString')).toEqual([]);
      });
    });

    describe('asserting toString has been touched', () => {
      test('does not have any side effects', () => {
        const document = eno.parse('');

        expect(() => document.assertAllTouched({ only: 'toString' })).not.toThrow();
      });
    });

  });

  describe('EnoDictionary', () => {

    describe('asserting toString has been touched', () => {
      test('does not have any side effects', () => {
        const document = eno.parse(`
          color ratings:
          red = 1
          blue = 2
        `);

        const dictionary = document.dictionary('color ratings');

        expect(() => dictionary.assertAllTouched({ only: 'toString' })).not.toThrow();
      });
    });

    describe('fetching a missing dictionary entry named toString', () => {
      test('does not have any side effects', () => {
        const document = eno.parse(`
          color ratings:
          red = 1
          blue = 2
        `);

        const dictionary = document.dictionary('color ratings');

        expect(dictionary.entry('toString')).toBe(null);
      });
    });

  });
});
