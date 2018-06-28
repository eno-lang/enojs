const eno = require('../../../eno.js');

const input = `
language:
- yml
- yaml

language:
- json
`.trim();

describe('validation.expectedFieldsGotList', () => {
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
