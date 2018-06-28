const eno = require('../../../eno.js');

const input = `
languages:
`.trim();

describe('validation.expectedSectionsGotEmpty', () => {
  const document = eno.parse(input);

  let error;
  try {
    document.sections('languages');
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
