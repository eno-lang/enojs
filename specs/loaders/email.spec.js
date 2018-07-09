const eno = require('enojs');

const examples = {
  'john.doe@eno-lang.org': 'john.doe@eno-lang.org',
  'john.doe@eno-lang':     false,
  '@eno-lang.org':         false,
  'john.doe@.org':         false
};

describe('email loader', () => {
  for(let [value, result] of Object.entries(examples)) {
    describe(value, () => {
      const document = eno.parse(`value: ${value}`);

      if(result === false) {
        it('throws an error', () => {
          expect(() => document.email('value')).toThrowErrorMatchingSnapshot();
        });
      } else {
        it(`returns ${result}`, () => {
          expect(document.email('value')).toBe(result);
        });
      }
    });
  }
});
