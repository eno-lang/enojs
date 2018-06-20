const eno = require('../../../eno.js');

describe('validation.missingValue', () => {

  let error;

  describe('missingDictionaryEntryValue', () => {

    beforeAll(() => {
      const document = eno.parse(`
        dictionary:
        required =
      `);

      try {
        document.dictionary('dictionary').entry('required', { required: true });
      } catch(err) {
        error = err;
      }
    })

    it('provides a correct message', () => {
      expect(error.message).toMatchSnapshot();
    });

    it('provides correct selection metadata', () => {
      expect(error.selection).toMatchSnapshot();
    });
  });

  describe('missingFieldValue', () => {

    beforeAll(() => {
      const document = eno.parse(`
        required:
      `);

      try {
        document.field('required', { required: true });
      } catch(err) {
        error = err;
      }
    })

    it('provides a correct message', () => {
      expect(error.message).toMatchSnapshot();
    });

    it('provides correct selection metadata', () => {
      expect(error.selection).toMatchSnapshot();
    });
  });

  describe('missingListItemValue', () => {

    beforeAll(() => {
      const document = eno.parse(`
        values required:
        - value
        -
      `);

      try {
        document.list('values required'); // { enforceValues: true } is default
      } catch(err) {
        error = err;
      }
    })

    it('provides a correct message', () => {
      expect(error.message).toMatchSnapshot();
    });

    it('provides correct selection metadata', () => {
      expect(error.selection).toMatchSnapshot();
    });
  });
});
