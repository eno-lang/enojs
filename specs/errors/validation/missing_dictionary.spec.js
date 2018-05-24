const eno = require('../../../eno.js');

describe('validation.missingDictionary', () => {
  const document = eno.parse(`
    # emptyness
  `);

  let error;
  try {
    document.section('emptyness').dictionary('presence');
  } catch(err) {
    error = err;
  }

  test(`provides correct message`, () => {
    expect(error.message).toMatchSnapshot();
  });

  test.skip(`provides correct selection metadata`, () => {
    // TODO: Currently observed metadata seems wrong, investigate
    expect(error.selection).toEqual([[2, 0], [10, 2]]);
  });
});
