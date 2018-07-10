const eno = require('enojs');

const examples = {
  '48.205870, 16.413690' : { lat: 48.205870, lng: 16.413690 },
  '41.25, -120.9762'     : { lat: 41.25,     lng: -120.9762 },
  '-31.96, 115.84'       : { lat: -31.96,    lng: 115.84 },
  '90, 0'                : { lat: 90,        lng: 0 },
  '   0   ,   0   '      : { lat: 0,         lng: 0 },
  '-0,-0'                : { lat: -0,        lng: -0 },
  '1000,10'              : false,
  '10,1000'              : false,
  '48.205870,'           : false,
  ', 16.413690'          : false,
  '48,205870, 16,413690' : false
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
