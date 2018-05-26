const eno = require('../../../eno.js');

describe('validation.expectedFieldGotFields', () => {
  const document = eno.parse(`
    eno: eno notation
    eno: eno notation language
  `);

  let error;
  try {
    document.field('eno');
  } catch(err) {
    error = err;
  }

  test(`provides correct message`, () => {
    expect(error.message).toMatchSnapshot();
  });

  test(`provides correct selection metadata`, () => {
    expect(error.selection).toEqual([[2, 0], [3, 30]]);
  });
});
