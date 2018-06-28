const eno = require('../../../eno.js');

const input = '# emptyness';

describe('validation.missingField', () => {
  const document = eno.parse(input);

  let error;
  try {
    document.section('emptyness').field('presence', { enforceElement: true });
  } catch(err) {
    error = err;
  }

  it('provides a correct message', () => {
    expect(error.message).toMatchSnapshot();
  });

  it('provides correct selection metadata', () => {
    expect(error.selection).toMatchSnapshot();
  });
});
