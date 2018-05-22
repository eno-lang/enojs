const { parse } = require('../eno.js');

const sample = `
Field: Value
List:
- Value
- Value
Dictionary:
Foo = Bar
Bar = Baz
Empty List:
`;

const expected = {
  dictionary: {
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
      dictionary: document.dictionary('Dictionary'),
      emptyList: document.list('Empty List'),
      field: document.field('Field'),
      list: document.list('List')
    };

    result.dictionary  = {
      foo: result.dictionary.entry('Foo'),
      bar: result.dictionary.entry('Bar')
    };

    expect(result).toEqual(expected);
  });
});
