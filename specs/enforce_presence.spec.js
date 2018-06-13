const { parse } = require('../eno.js');

const sample = `
dictionary:
present = yes

# section

dictionary in section:
present = yes
`;

describe('Presence of elements', () => {
  test('not enforced by default', () => {
    const doc = parse(sample);
    const section = doc.section('section');
    const result = {
      dictionaryEntry: doc.dictionary('dictionary').entry('missing'),
      field: doc.field('missing'),
      section: {
        dictionaryEntry: section.dictionary('dictionary in section').entry('missing'),
        field: section.field('missing')
      }
    };

    const expected = {
      dictionaryEntry: null,
      field: null,
      section: {
        dictionaryEntry: null,
        field: null
      }
    };

    expect(result).toEqual(expected);
  });

  test('enforced when requested', () => {
    const doc = parse(sample);

    doc.enforceElements(true);

    const section = doc.section('section');

    expect(() => doc.dictionary('dictionary').entry('missing')).toThrowErrorMatchingSnapshot();
    expect(() => doc.field('missing')).toThrowErrorMatchingSnapshot();
    expect(() => section.dictionary('dictionary in section').entry('missing')).toThrowErrorMatchingSnapshot();
    expect(() => section.field('missing')).toThrowErrorMatchingSnapshot();
  });
});
