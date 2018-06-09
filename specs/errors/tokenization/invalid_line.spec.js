const eno = require('../../../eno.js');

describe('tokenization.invalidLine', () => {
  const input = `
    languages:
    - eno
    - json
    yaml
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
    expect(error.selection).toEqual([[5, 0], [5, 8]]);
  });
});
