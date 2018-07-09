const eno = require('enojs');

const examples = {
  '48.205870, 16.413690': { lat: 48.205870, lng: 16.413690 },
  '48.205870,':           false,
  ', 16.413690':          false,
  '48,205870, 16,413690': false
};

describe('latLng loader', () => {
  for(let [value, result] of Object.entries(examples)) {
    describe(value, () => {
      const document = eno.parse(`value: ${value}`);

      if(result === false) {
        it('throws an error', () => {
          expect(() => document.latLng('value')).toThrowErrorMatchingSnapshot();
        });
      } else {
        it(`returns ${result}`, () => {
          expect(document.latLng('value')).toEqual(result);
        });
      }
    });
  }
});
