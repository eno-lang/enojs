const eno = require('../../../eno.js');

const input = `
languages:
- eno (eno notation)
- json (javascript object notation)
`.trim();

describe('validation.expectedFieldGotList', () => {
  const document = eno.parse(input);

  let error;
  try {
    document.field('languages');
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
