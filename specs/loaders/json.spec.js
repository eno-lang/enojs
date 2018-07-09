const eno = require('enojs');

const examples = {
  '{ "valid": true }':    { valid: true },
  '42':                   42,
  '["valid", true]':      ['valid', true],
  'invalid':              false,
  '{ invalid: true }':    false,
  '{ "invalid": true, }': false
};

describe('json loader', () => {
  for(let [value, result] of Object.entries(examples)) {
    describe(value, () => {
      const document = eno.parse(`value: ${value}`);

      if(result === false) {
        it('throws an error', () => {
          expect(() => document.json('value')).toThrowErrorMatchingSnapshot();
        });
      } else {
        it(`returns ${result}`, () => {
          expect(document.json('value')).toEqual(result);
        });
      }
    });
  }
});
