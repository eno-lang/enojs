const eno = require('enojs');

const examples = {
  '#abcdef': '#abcdef',
  '#ABCDEF': '#ABCDEF',
  '#012345': '#012345',
  '#678':    '#678',
  '#89a':    '#89a',
  '#ab':     false,
  '#abcd':   false,
  '#abcde':  false,
  '#bcdefg': false,
  'blue':    false
};

describe('color loader', () => {
  for(let [value, result] of Object.entries(examples)) {
    describe(value, () => {
      const document = eno.parse(`value: ${value}`);

      if(result === false) {
        it('throws an error', () => {
          expect(() => document.color('value')).toThrowErrorMatchingSnapshot();
        });
      } else {
        it(`returns ${result}`, () => {
          expect(document.color('value')).toBe(result);
        });
      }
    });
  }
});
