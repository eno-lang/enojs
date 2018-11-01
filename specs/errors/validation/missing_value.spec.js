const eno = require('../../../eno.js');

describe('validation.missingValue', () => {

  let error;

  describe('missingFieldsetEntryValue', () => {
    beforeAll(() => {
      const document = eno.parse(`
        fieldset:
        required =
      `);

      try {
        document.fieldset('fieldset').entry('required', { required: true });
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
    describe('without empty line continuations', () => {
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

    describe('with empty line continuations', () => {
      beforeAll(() => {
        const document = eno.parse(`
          required:
          |

          |
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
