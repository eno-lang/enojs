const eno = require('../../../eno.js');

const input = 'emptyness:';

describe('validation.missingDictionaryEntry', () => {
  describe('via EnoDictionary element', () => {
    const document = eno.parse(input);

    let error;
    try {
      document.dictionary('emptyness').element('presence', { enforceElement: true });
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

  describe('via EnoDictionary entry', () => {
    const document = eno.parse(input);

    let error;
    try {
      document.dictionary('emptyness').entry('presence', { enforceElement: true });
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
