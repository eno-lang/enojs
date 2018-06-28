const eno = require('../../../eno.js');

const input = `
languages:
- eno
- json
`.trim();

describe('validation.exactCountNotMet', () => {
  const document = eno.parse(input);

  let error;
  try {
    document.list('languages', { exactCount: 5 });
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
