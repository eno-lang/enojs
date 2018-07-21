const eno = require('../../../eno.js');

const input = `
languages:
| eno (eno notation)
| json (JavaScript Object Notation)
`.trim();

describe('validation.expectedFieldsetGotField', () => {
  const document = eno.parse(input);

  let error;
  try {
    document.fieldset('languages');
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
