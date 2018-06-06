const eno = require('../../../eno.js');

const input = `
# section
### subsection
`.trim();

describe('analysis.sectionHierarchyLayerSkip', () => {

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
    expect(error.selection).toEqual([[2, 0], [2, 14]]);
  });
});
