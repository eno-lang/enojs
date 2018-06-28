const eno = require('../../../eno.js');

const input = `
language: eno
language: json
`.trim();

describe('validation.expectedElementGotElements', () => {
  const document = eno.parse(input);

  let error;
  try {
    document.element('language');
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
