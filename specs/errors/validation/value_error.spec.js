const eno = require('../../../eno.js');

describe('validation.valueError', () => {
  const document = eno.parse('language: yaml');

  const loader = ({ name, value }) => {
    if(value !== 'eno') {
      throw `'${name}' must be 'eno', not '${value}'.`;
    }
  };

  let error;
  try {
    document.field('language', loader);
  } catch(err) {
    error = err;
  }

  test(`provides correct message`, () => {
    expect(error.message).toMatchSnapshot();
  });

  test(`provides correct selection metadata`, () => {
    expect(error.selection).toEqual([[1, 10], [1, 14]]);
  });

  describe('calling getError on a field', () => {
    const document = eno.parse('language: yaml');

    const field = document.sequential()[0];
    const error = field.getError();

    test(`provides correct message`, () => {
      expect(error.message).toMatchSnapshot();
    });

    test(`provides correct selection metadata`, () => {
      expect(error.selection).toEqual([[1, 10], [1, 14]]);
    });

    describe('providing a custom message', () => {
      const document = eno.parse('language: yaml');

      const field = document.sequential()[0];
      const error = field.getError(' a highly custom error');

      test(`provides correct message`, () => {
        expect(error.message).toMatchSnapshot();
      });

      test(`provides correct selection metadata`, () => {
        expect(error.selection).toEqual([[1, 10], [1, 14]]);
      });
    });

    describe('providing an error function', () => {
      const document = eno.parse('language: yaml');

      const field = document.sequential()[0];
      const error = field.getError(({ name, value }) => `${name} can not be ${value}`);

      test(`provides correct message`, () => {
        expect(error.message).toMatchSnapshot();
      });

      test(`provides correct selection metadata`, () => {
        expect(error.selection).toEqual([[1, 10], [1, 14]]);
      });
    });
  });

  describe('calling getError on an empty element', () => {
    const document = eno.parse('language:');

    const empty = document.sequential()[0];
    const error = empty.getError();

    test(`provides correct message`, () => {
      expect(error.message).toMatchSnapshot();
    });

    test(`provides correct selection metadata`, () => {
      expect(error.selection).toEqual([[1, 9], [1, 9]]);
    });

    describe('providing a custom message', () => {
      const document = eno.parse('language:');

      const empty = document.sequential()[0];
      const error = empty.getError('a highly custom error');

      test(`provides correct message`, () => {
        expect(error.message).toMatchSnapshot();
      });

      test(`provides correct selection metadata`, () => {
        expect(error.selection).toEqual([[1, 9], [1, 9]]);
      });
    });

    describe('providing an error function', () => {
      const document = eno.parse('language:');

      const empty = document.sequential()[0];
      const error = empty.getError(({ name, value }) => `${name} can not be ${value}`);

      test(`provides correct message`, () => {
        expect(error.message).toMatchSnapshot();
      });

      test(`provides correct selection metadata`, () => {
        expect(error.selection).toEqual([[1, 9], [1, 9]]);
      });
    });
  });
});
