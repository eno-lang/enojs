const eno = require('../../../eno.js');

const input = `
languages:
`.trim();

describe('validation.expectedSectionGotEmpty', () => {
  const document = eno.parse(input);

  let error;
  try {
    document.section('languages');
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
