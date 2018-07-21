const eno = require('../../../eno.js');

const input = `
language:
yaml = yaml ain't markup language

language:
json = javascript object notation
`.trim();

describe('validation.expectedFieldsGotFieldset', () => {
  const document = eno.parse(input);

  let error;
  try {
    document.fields('language');
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
