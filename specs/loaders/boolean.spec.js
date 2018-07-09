const eno = require('enojs');

const examples = {
  'true':  true,
  'false': false,
  'yes':   true,
  'no':    false,
  'nope':  null
};

describe('boolean loader', () => {
  for(let [value, result] of Object.entries(examples)) {
    describe(value, () => {
      const document = eno.parse(`value: ${value}`);

      if(result === null) {
        it('throws an error', () => {
          expect(() => document.boolean('value')).toThrowErrorMatchingSnapshot();
        });
      } else {
        it(`returns ${result}`, () => {
          expect(document.boolean('value')).toBe(result);
        });
      }
    });
  }
});
