const eno = require('../../../eno.js');

describe('tokenization.unterminatedEscapedName', () => {
  const input = `
    \`language: eno
  `;

  let error;

  beforeAll(() => {
    try {
      eno.parse(input);
    } catch(err) {
      error = err;
    }
  });

  it(`provides a correct message`, () => {
    expect(error.message).toMatchSnapshot();
  });

  it(`provides correct selection metadata`, () => {
    expect(error.selection).toMatchSnapshot();
  });
});
