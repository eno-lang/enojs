const eno = require('enojs');

const examples = {
  '42':       42,
  '-42':      -42,
  '42.0':     false,
  '42,0':     false,
  '4 2':      false,
  'fortytwo': false
};

describe('integer loader', () => {
  for(let [value, result] of Object.entries(examples)) {
    describe(value, () => {
      const document = eno.parse(`value: ${value}`);

      if(result === false) {
        it('throws an error', () => {
          expect(() => document.integer('value')).toThrowErrorMatchingSnapshot();
        });
      } else {
        it(`returns ${result}`, () => {
          expect(document.integer('value')).toBe(result);
        });
      }
    });
  }
});
