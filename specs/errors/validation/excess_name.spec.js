const eno = require('../../../eno.js');

const input = 'language: eno';

describe('validation.excessName', () => {
  describe('without a custom message', () => {
    const document = eno.parse(input);

    let error;
    try {
      document.assertAllTouched();
    } catch(err) {
      error = err;
    }

    it(`provides a correct message`, () => {
      expect(error.message).toMatchSnapshot();
    });

    it(`provides correct selection metadata`, () => {
      expect(error.selection).toMatchSnapshot();
    });
  });

  describe('with a custom message', () => {
    const document = eno.parse(input);

    let error;
    try {
      document.assertAllTouched('my custom message');
    } catch(err) {
      error = err;
    }

    it(`provides a correct message`, () => {
      expect(error.message).toMatchSnapshot();
    });

    it(`provides correct selection metadata`, () => {
      expect(error.selection).toMatchSnapshot();
    });
  });
});
