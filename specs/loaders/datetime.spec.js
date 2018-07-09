const eno = require('enojs');

const examples = {
  '1990':                         '1990-01-01T00:00:00.000Z',
  '1991-01':                      '1991-01-01T00:00:00.000Z',
  '1992-02-02':                   '1992-02-02T00:00:00.000Z',
  '1993-03-03T19:20+01:00':       '1993-03-03T18:20:00.000Z',
  '1994-04-04T19:20:30+01:00':    '1994-04-04T18:20:30.000Z',
  '1995-05-05T19:20:30.45+01:00': '1995-05-05T18:20:30.450Z',
  '1996-06-06T08:15:30-05:00':    '1996-06-06T13:15:30.000Z',
  '1997-07-07T13:15:30Z':         '1997-07-07T13:15:30.000Z',
  '2002 12 14':                   false,
  '2002-12-14 20:15':             false,
  'January':                      false,
  '13:00':                        false
};

describe('datetime loader', () => {
  for(let [value, result] of Object.entries(examples)) {
    describe(value, () => {
      const document = eno.parse(`value: ${value}`);

      if(result === false) {
        it('throws an error', () => {
          expect(() => document.datetime('value')).toThrowErrorMatchingSnapshot();
        });
      } else {
        it(`returns ${result}`, () => {
          expect(document.datetime('value').toISOString()).toBe(result);
        });
      }
    });
  }
});
