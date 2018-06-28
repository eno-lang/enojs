const eno = require('../../../eno.js');

const input = `
# languages
eno: eno notation
yaml: yaml ain't markup language
`.trim();

describe('validation.expectedListGotSection', () => {
  const document = eno.parse(input);

  let error;
  try {
    document.list('languages');
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
