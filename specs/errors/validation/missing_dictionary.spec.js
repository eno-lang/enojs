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

  it('provides a correct message', () => {
    expect(error.message).toMatchSnapshot();
  });

  it('provides correct selection metadata', () => {
    expect(error.selection).toEqual([[2, 15], [2, 15]]);
  });
});
