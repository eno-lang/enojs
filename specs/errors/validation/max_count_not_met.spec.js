const eno = require('../../../eno.js');

const input = `
languages:
- cson
- eno
- json
- yaml
`.trim();

describe('validation.maxCountNotMet', () => {
  const document = eno.parse(input);

  let error;
  try {
    document.list('languages', { maxCount: 3 });
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
