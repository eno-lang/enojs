const eno = require('enojs');

const examples = {
  '42':       42.0,
  '-42':      -42.0,
  '42.0':     42.0,
  '42,0':     false,
  '4 2.0':    false,
  'fortytwo': false
};

describe('float loader', () => {
  for(let [value, result] of Object.entries(examples)) {
    describe(value, () => {
      const document = eno.parse(`value: ${value}`);

      if(result === false) {
        it('throws an error', () => {
          expect(() => document.float('value')).toThrowErrorMatchingSnapshot();
        });
      } else {
        it(`returns ${result}`, () => {
          expect(document.float('value')).toBe(result);
        });
      }
    });
  }
});
