const eno = require('../../../eno.js');

const input = `
languages:
eno = eno notation

languages:
json = JavaScript Object Notation

languages:
- yaml (YAML Ain't Markup Language)
`.trim();

describe('validation.expectedDictionariesGotList', () => {
  const document = eno.parse(input);

  let error;
  try {
    document.dictionaries('languages');
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
