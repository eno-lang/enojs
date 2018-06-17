const eno = require('../../../eno.js');

const input = `
language:
| eno
json = JavaScript Object Notation
`.trim();

describe('analysis.dictionaryEntryInField', () => {

  let error;

  beforeAll(() => {
    try {
      eno.parse(input);
    } catch(err) {
      error = err;
    }
  })

  it(`provides the correct message`, () => {
    expect(error.message).toMatchSnapshot();
  });

  it(`provides correct selection metadata`, () => {
    expect(error.selection).toMatchSnapshot();
  });
});
