const eno = require('enojs');

const examples = {
  'http://www.valid.com':  'http://www.valid.com',
  'https://valid.com':     'https://valid.com',
  'https://www.valid.com': 'https://www.valid.com',
  'invalid':               false,
  'www.invalid':           false,
  'www.invalid.com':       false,
  'htp://www.invalid.com': false,
  'http:/invalid.com':     false,
  'https//invalid.com':    false,
  'https://invalid':       false
};

describe('url loader', () => {
  for(let [value, result] of Object.entries(examples)) {
    describe(value, () => {
      const document = eno.parse(`value: ${value}`);

      if(result === false) {
        it('throws an error', () => {
          expect(() => document.url('value')).toThrowErrorMatchingSnapshot();
        });
      } else {
        it(`returns '${result}'`, () => {
          expect(document.url('value')).toBe(result);
        });
      }
    });
  }
});
