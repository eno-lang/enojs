const eno = require('../../../eno.js');

const input = `
original: value
original: value

copy < original
`.trim();

describe('resolution.multipleTemplatesFound', () => {

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
    expect(error.selection).toEqual([[4, 0], [4, 15]]);
  });
});
