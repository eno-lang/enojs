const { parse } = require('../eno.js');

const sample = `
Field: Value
List:
- Value
- Value
Fieldset:
Foo = Bar
Bar = Baz
Empty List:
`;

const expected = {
  fieldset: {
    foo: 'Bar',
    bar: 'Baz'
  },
  emptyList: [],
  field: 'Value',
  list: [
    'Value',
    'Value'
  ]
};

describe('Getters', () => {
  test('return values as expected', () => {
    const document = parse(sample);

    const result = {
      fieldset: document.fieldset('Fieldset'),
      emptyList: document.list('Empty List'),
      field: document.field('Field'),
      list: document.list('List')
    };

    result.fieldset  = {
      foo: result.fieldset.entry('Foo'),
      bar: result.fieldset.entry('Bar')
    };

    expect(result).toEqual(expected);
  });
});
