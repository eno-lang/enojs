const { parse } = require('../eno.js');

const sample = `
Field: Value
List:
- Value
- Value
Empty List:
`;

const expected = {
  field: 'Value of Field',
  list: [
    'Value inside a List',
    'Value inside a List'
  ],
  emptyList: []
};

const fieldLoader = ({ name, value }) => {
  return `${value} of ${name}`;
};

const listLoader = ({ name, value }) => {
  return `${value} inside a ${name}`;
};

describe('Loaders', () => {
  test('transform values as specified', () => {
    const document = parse(sample);

    const result = {
      field: document.field('Field', fieldLoader),
      list: document.list('List', listLoader),
      emptyList: document.list('Empty List', listLoader)
    };

    expect(result).toEqual(expected);
  });
});
