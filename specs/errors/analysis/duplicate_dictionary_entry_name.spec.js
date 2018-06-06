const eno = require('../../../eno.js');

const input = `
languages:
eno = eno notation
json = JavaScript Object Notation
eno = eno notation
`.trim();

describe('analysis.duplicateDictionaryEntryName', () => {

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
    expect(error.selection).toEqual([[4, 0], [4, 18]]);
  });
});
