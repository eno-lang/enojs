const eno = require('../../eno.js');
const Field = require('../../lib/elements/field.js');

const context = {};
const instruction = { name: 'language', value: 'eno' };
const instructionNamedValueless = { name: 'language', value: null };
const instructionUnnamedValue = { value: 'eno' };
const instructionUnnamedLongValue = { value: 'The language is eno' };
const instructionVoid = {};
const parent = {};

describe('Field', () => {

  let field;

  beforeEach(() => {
    field = new Field(context, instruction, parent);
  });

  it('is untouched after initialization', () => {
    expect(field.touched).toBe(false);
  });

  describe('isEmpty()', () => {
    describe('when not empty', () => {
      it('returns false', () => {
        expect(field.isEmpty()).toBe(false);
      });
    });

    describe('when empty', () => {
      it('returns true', () => {
        const namedEmptyField = new Field(context, instructionNamedValueless, parent);
        expect(namedEmptyField.isEmpty()).toBe(true);
      });
    });
  });

  describe('raw()', () => {
    describe('with a name and a value', () => {
      it('returns a native representation', () => {
        expect(field.raw()).toEqual({ language: 'eno' });
      });
    });

    describe('with an unnamed value', () => {
      it('returns a native representation', () => {
        const unnamedField = new Field(context, instructionUnnamedValue, parent);
        expect(unnamedField.raw()).toEqual('eno');
      });
    });
  });

  describe('toString()', () => {
    describe('with a name and a value', () => {
      it('returns a debug abstraction', () => {
        expect(field.toString()).toEqual('[object Field name="language" value="eno"]');
      });
    });

    describe('with a name and no value', () => {
      it('returns a debug abstraction', () => {
        const namedEmptyField = new Field(context, instructionNamedValueless, parent);
        expect(namedEmptyField.toString()).toEqual('[object Field name="language" value=null]');
      });
    });

    describe('with an unnamed value', () => {
      it('returns a debug abstraction', () => {
        const unnamedField = new Field(context, instructionUnnamedValue, parent);
        expect(unnamedField.toString()).toEqual('[object Field value="eno"]');
      });
    });

    describe('with no name and value', () => {
      it('returns a debug abstraction', () => {
        const voidField = new Field(context, instructionVoid, parent);
        expect(voidField.toString()).toEqual('[object Field value=null]');
      });
    });

    describe('with no name and a long value', () => {
      it('returns a debug abstraction with a truncated value', () => {
        const unnamedLongValueField = new Field(context, instructionUnnamedLongValue, parent);
        expect(unnamedLongValueField.toString()).toEqual('[object Field value="The languag..."]');
      });
    });
  });

  describe('toStringTag symbol', () => {
    it('returns a custom tag', () => {
      expect(Object.prototype.toString.call(field)).toEqual('[object Field]');
    });
  });

  describe('value()', () => {
    it('returns the value', () => {
      expect(field.value()).toEqual('eno');
    });

    it('touches the element', () => {
      const _ = field.value();
      expect(field.touched).toBe(true);
    });

    describe('with a loader function', () => {
      it('applies the loader', () => {
        const result = field.value(({ value }) => value.toUpperCase());
        expect(result).toEqual('ENO');
      });

      it('touches the element', () => {
        const _ = field.value(({ value }) => value.toUpperCase());
        expect(field.touched).toBe(true);
      });
    });

    describe("'required' alias for 'enforceValue'", () => {
      let emptyField;

      beforeEach(() => {
        const input = `
          language:
          |
        `;

        emptyField = eno.parse(input).element('language');
      });

      describe('when not set', () => {
        it('returns null', () => {
          expect(emptyField.value()).toBe(null);
        });
      });

      describe('when set to true', () => {
        it('throws an error', () => {
          expect(() => emptyField.value({ required: true })).toThrowErrorMatchingSnapshot();
        });
      });
    });
  });
});
