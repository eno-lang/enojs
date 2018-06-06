const eno = require('../../../eno.js');

const input = `
eno = eno notation
`.trim();

describe('analysis.listItemInField', () => {

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
    expect(error.selection).toEqual([[1, 0], [1, 18]]);
  });
});
