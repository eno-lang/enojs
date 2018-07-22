const eno = require('../../../eno.js');

const input = 'emptyness:';

describe('validation.missingFieldsetEntry', () => {
  describe('via Fieldset element', () => {
    const document = eno.parse(input);

    let error;
    try {
      document.fieldset('emptyness').element('presence', { enforceElement: true });
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

  describe('via Fieldset entry', () => {
    const document = eno.parse(input);

    let error;
    try {
      document.fieldset('emptyness').entry('presence', { enforceElement: true });
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
});
