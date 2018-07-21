const { parse } = require('../eno.js');

const sample = `
fieldset:
present = yes

# section

fieldset in section:
present = yes
`;

describe('enforceAllElements', () => {
  it('is not active by default', () => {
    const doc = parse(sample);
    const section = doc.section('section');
    const result = {
      fieldsetEntry: doc.fieldset('fieldset').entry('missing'),
      field: doc.field('missing'),
      section: {
        fieldsetEntry: section.fieldset('fieldset in section').entry('missing'),
        field: section.field('missing')
      }
    };

    const expected = {
      fieldsetEntry: null,
      field: null,
      section: {
        fieldsetEntry: null,
        field: null
      }
    };

    expect(result).toEqual(expected);
  });

  it('is enforced when requested', () => {
    const doc = parse(sample);

    doc.enforceAllElements();

    const section = doc.section('section');

    expect(() => doc.fieldset('fieldset').entry('missing')).toThrowErrorMatchingSnapshot();
    expect(() => doc.field('missing')).toThrowErrorMatchingSnapshot();
    expect(() => section.fieldset('fieldset in section').entry('missing')).toThrowErrorMatchingSnapshot();
    expect(() => section.field('missing')).toThrowErrorMatchingSnapshot();
  });
});
