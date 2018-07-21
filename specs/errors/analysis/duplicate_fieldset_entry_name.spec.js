const eno = require('../../../eno.js');

const input = `
languages:
eno = eno notation
json = JavaScript Object Notation
eno = eno notation
`.trim();

describe('analysis.duplicateFieldsetEntryName', () => {

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
