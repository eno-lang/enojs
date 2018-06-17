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
    expect(error.selection).toMatchSnapshot();
  });

  describe('calling error on a field', () => {
    const document = eno.parse('language: yaml');
    const field = document.elements()[0];

    const error = field.error();

    it(`provides a correct message`, () => {
      expect(error.message).toMatchSnapshot();
    });

    it(`provides correct selection metadata`, () => {
      expect(error.selection).toMatchSnapshot();
    });

    describe('providing a custom message', () => {
      const error = field.error(' a highly custom error');

      it(`provides a correct message`, () => {
        expect(error.message).toMatchSnapshot();
      });

      it(`provides correct selection metadata`, () => {
        expect(error.selection).toMatchSnapshot();
      });
    });

    describe('providing an error function', () => {
      const error = field.error(({ name, value }) => `${name} can not be ${value}`);

      it(`provides a correct message`, () => {
        expect(error.message).toMatchSnapshot();
      });

      it(`provides correct selection metadata`, () => {
        expect(error.selection).toMatchSnapshot();
      });
    });
  });

  describe('calling error on an empty element', () => {
    const document = eno.parse('language:');
    const empty = document.elements()[0];

    const error = empty.error();

    it(`provides a correct message`, () => {
      expect(error.message).toMatchSnapshot();
    });

    it(`provides correct selection metadata`, () => {
      expect(error.selection).toMatchSnapshot();
    });

    describe('providing a custom message', () => {
      const error = empty.error('a highly custom error');

      it(`provides a correct message`, () => {
        expect(error.message).toMatchSnapshot();
      });

      it(`provides correct selection metadata`, () => {
        expect(error.selection).toMatchSnapshot();
      });
    });

    describe('providing an error function', () => {
      const error = empty.error(({ name, value }) => `${name} can not be ${value}`);

      it(`provides a correct message`, () => {
        expect(error.message).toMatchSnapshot();
      });

      it(`provides correct selection metadata`, () => {
        expect(error.selection).toMatchSnapshot();
      });
    });
  });

  describe('calling error on a block', () => {
    const document = eno.parse(`
      -- language
      eno
      -- language
    `);

    const block = document.elements()[0];
    const error = block.error();

    it(`provides a correct message`, () => {
      expect(error.message).toMatchSnapshot();
    });

    it(`provides correct selection metadata`, () => {
      expect(error.selection).toMatchSnapshot();
    });

    describe('providing a custom message', () => {
      const error = block.error('a highly custom error');

      it(`provides a correct message`, () => {
        expect(error.message).toMatchSnapshot();
      });

      it(`provides correct selection metadata`, () => {
        expect(error.selection).toMatchSnapshot();
      });
    });

    describe('providing an error function', () => {
      const error = block.error(({ name, value }) => `${name} can not be ${value}`);

      it(`provides a correct message`, () => {
        expect(error.message).toMatchSnapshot();
      });

      it(`provides correct selection metadata`, () => {
        expect(error.selection).toMatchSnapshot();
      });
    });
  });

  describe('calling error on an empty block', () => {
    const document = eno.parse(`
      -- language
      -- language
    `);

    const block = document.elements()[0];
    const error = block.error();

    it(`provides a correct message`, () => {
      expect(error.message).toMatchSnapshot();
    });

    it(`provides correct selection metadata`, () => {
      expect(error.selection).toMatchSnapshot();
    });

    describe('providing a custom message', () => {
      const error = block.error('a highly custom error');

      it(`provides a correct message`, () => {
        expect(error.message).toMatchSnapshot();
      });

      it(`provides correct selection metadata`, () => {
        expect(error.selection).toMatchSnapshot();
      });
    });

    describe('providing an error function', () => {
      const error = block.error(({ name, value }) => `${name} can not be ${value}`);

      it(`provides a correct message`, () => {
        expect(error.message).toMatchSnapshot();
      });

      it(`provides correct selection metadata`, () => {
        expect(error.selection).toMatchSnapshot();
      });
    });
  });

  // TODO: Specs for valueErrors on fields that were constructed with multiple appendices
  //       (In order to evaluate and probably increase their quality)
});
