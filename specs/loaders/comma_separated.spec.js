const eno = require('enojs');

const examples = {
  'one,two,three':     ['one', 'two', 'three'],
  'one , two , three': ['one', 'two', 'three'],
  ',,':                ['', '', ''],
  'one two three':     ['one two three'],
  'one;two;three':     ['one;two;three']
};

describe('commaSeparated loader', () => {
  for(let [value, result] of Object.entries(examples)) {
    describe(value, () => {
      const document = eno.parse(`value: ${value}`);

      it(`returns ${result}`, () => {
        expect(document.commaSeparated('value')).toEqual(result);
      });
    });
  }
});
