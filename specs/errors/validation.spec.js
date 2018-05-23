const eno = require('../../eno.js');

describe('validation.valueError', () => {
  const document = eno.parse('language: yaml');

  const loader = ({ name, value }) => {
    if(value !== 'eno') {
      throw `'${name}' must be 'eno', not '${value}'.`;
    }
  };

  let error;
  try {
    document.field('language', loader);
  } catch(err) {
    error = err;
  }

  test(`provides correct message`, () => {
    expect(error.message).toMatchSnapshot();
  });

  test(`provides correct selection metadata`, () => {
    expect(error.selection).toEqual([[1, 10], [1, 14]]);
  });
});
