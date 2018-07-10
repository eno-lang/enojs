const eno = require('enojs');

const examples = {
  '1992-02-02':                   '1992-02-02T00:00:00.000Z',
  '1990':                         false,
  '1991-01':                      false,
  '1993-03-03T19:20+01:00':       false,
  '1994-04-04T19:20:30+01:00':    false,
  '1995-05-05T19:20:30.45+01:00': false,
  '1996-06-06T08:15:30-05:00':    false,
  '1997-07-07T13:15:30Z':         false,
  '2002 12 14':                   false,
  '2002-12-14 20:15':             false,
  'January':                      false,
  '13:00':                        false
};

describe('date loader', () => {
  for(let [value, result] of Object.entries(examples)) {
    describe(value, () => {
      const document = eno.parse(`value: ${value}`);

      if(result === false) {
        it('throws an error', () => {
          expect(() => document.date('value')).toThrowErrorMatchingSnapshot();
        });
      } else {
        it(`returns ${result}`, () => {
          expect(document.date('value').toISOString()).toBe(result);
        });
      }
    });
  }
});
