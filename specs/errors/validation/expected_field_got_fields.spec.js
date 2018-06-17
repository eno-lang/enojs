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

  it(`provides a correct message`, () => {
    expect(error.message).toMatchSnapshot();
  });

  it(`provides correct selection metadata`, () => {
    expect(error.selection).toMatchSnapshot();
  });
});
