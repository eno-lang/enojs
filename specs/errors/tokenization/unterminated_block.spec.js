const eno = require('../../../eno.js');

describe('tokenization.unterminatedBlock', () => {
  const input = `
    -- languages
    eno
    json
    yaml
    - languages
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
    expect(error.selection).toEqual([[2, 4], [2, 16]]);
  });
});
