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

  it(`provides a correct message`, () => {
    expect(error.message).toMatchSnapshot();
  });

  it(`provides correct selection metadata`, () => {
    expect(error.selection).toEqual([[1, 10], [1, 14]]);
  });

  describe('calling getError on a field', () => {
    const document = eno.parse('language: yaml');
    const field = document.sequential()[0];

    const error = field.getError();

    it(`provides a correct message`, () => {
      expect(error.message).toMatchSnapshot();
    });

    it(`provides correct selection metadata`, () => {
      expect(error.selection).toEqual([[1, 10], [1, 14]]);
    });

    describe('providing a custom message', () => {
      const error = field.getError(' a highly custom error');

      it(`provides a correct message`, () => {
        expect(error.message).toMatchSnapshot();
      });

      it(`provides correct selection metadata`, () => {
        expect(error.selection).toEqual([[1, 10], [1, 14]]);
      });
    });

    describe('providing an error function', () => {
      const error = field.getError(({ name, value }) => `${name} can not be ${value}`);

      it(`provides a correct message`, () => {
        expect(error.message).toMatchSnapshot();
      });

      it(`provides correct selection metadata`, () => {
        expect(error.selection).toEqual([[1, 10], [1, 14]]);
      });
    });
  });

  describe('calling getError on an empty element', () => {
    const document = eno.parse('language:');
    const empty = document.sequential()[0];

    const error = empty.getError();

    it(`provides a correct message`, () => {
      expect(error.message).toMatchSnapshot();
    });

    it(`provides correct selection metadata`, () => {
      expect(error.selection).toEqual([[1, 9], [1, 9]]);
    });

    describe('providing a custom message', () => {
      const error = empty.getError('a highly custom error');

      it(`provides a correct message`, () => {
        expect(error.message).toMatchSnapshot();
      });

      it(`provides correct selection metadata`, () => {
        expect(error.selection).toEqual([[1, 9], [1, 9]]);
      });
    });

    describe('providing an error function', () => {
      const error = empty.getError(({ name, value }) => `${name} can not be ${value}`);

      it(`provides a correct message`, () => {
        expect(error.message).toMatchSnapshot();
      });

      it(`provides correct selection metadata`, () => {
        expect(error.selection).toEqual([[1, 9], [1, 9]]);
      });
    });
  });

  describe('calling getError on a block', () => {
    const document = eno.parse(`
      -- language
      eno
      -- language
    `);

    const block = document.sequential()[0];
    const error = block.getError();

    it(`provides a correct message`, () => {
      expect(error.message).toMatchSnapshot();
    });

    it(`provides correct selection metadata`, () => {
      expect(error.selection).toEqual([[3, 0], [3, 9]]);
    });

    describe('providing a custom message', () => {
      const error = block.getError('a highly custom error');

      it(`provides a correct message`, () => {
        expect(error.message).toMatchSnapshot();
      });

      it(`provides correct selection metadata`, () => {
        expect(error.selection).toEqual([[3, 0], [3, 9]]);
      });
    });

    describe('providing an error function', () => {
      const error = block.getError(({ name, value }) => `${name} can not be ${value}`);

      it(`provides a correct message`, () => {
        expect(error.message).toMatchSnapshot();
      });

      it(`provides correct selection metadata`, () => {
        expect(error.selection).toEqual([[3, 0], [3, 9]]);
      });
    });
  });

  describe('calling getError on an empty block', () => {
    const document = eno.parse(`
      -- language
      -- language
    `);

    const block = document.sequential()[0];
    const error = block.getError();

    it(`provides a correct message`, () => {
      expect(error.message).toMatchSnapshot();
    });

    it(`provides correct selection metadata`, () => {
      expect(error.selection).toEqual([[2, 17], [2, 17]]);
    });

    describe('providing a custom message', () => {
      const error = block.getError('a highly custom error');

      it(`provides a correct message`, () => {
        expect(error.message).toMatchSnapshot();
      });

      it(`provides correct selection metadata`, () => {
        expect(error.selection).toEqual([[2, 17], [2, 17]]);
      });
    });

    describe('providing an error function', () => {
      const error = block.getError(({ name, value }) => `${name} can not be ${value}`);

      it(`provides a correct message`, () => {
        expect(error.message).toMatchSnapshot();
      });

      it(`provides correct selection metadata`, () => {
        expect(error.selection).toEqual([[2, 17], [2, 17]]);
      });
    });
  });

  // TODO: Specs for valueErrors on fields that were constructed with multiple appendices
  //       (In order to evaluate and probably increase their quality)
});
