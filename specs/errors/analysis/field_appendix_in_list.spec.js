const eno = require('../../../eno.js');

const input = `
languages:
- eno
| json
`.trim();

describe('analysis.fieldAppendInList', () => {

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
    expect(error.selection).toEqual([[3, 0], [3, 6]]);
  });
});
