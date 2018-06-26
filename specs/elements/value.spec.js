const eno = require('../../eno.js');
const EnoValue = require('../../lib/elements/value.js');

const context = {};
const instruction = { name: 'language', value: 'eno' };
const instructionNamedEmpty = { name: 'language', value: null };
const instructionUnnamedValue = { value: 'eno' };
const instructionUnnamedLongValue = { value: 'The language is eno' };
const instructionVoid = {};
const parent = {};

describe('EnoValue', () => {

  let value;

  beforeEach(() => {
    value = new EnoValue(context, instruction, parent);
  });

  it('is untouched after initialization', () => {
    expect(value.touched).toBe(false);
  });

  describe('isEmpty()', () => {
    describe('when not empty', () => {
      it('returns false', () => {
        expect(value.isEmpty()).toBe(false);
      });
    });

    describe('when empty', () => {
      it('returns true', () => {
        const namedEmptyValue = new EnoValue(context, instructionNamedEmpty, parent);
        expect(namedEmptyValue.isEmpty()).toBe(true);
      });
    });
  });

  describe('raw()', () => {
    describe('with a name and a value', () => {
      it('returns a native representation', () => {
        expect(value.raw()).toEqual({ language: 'eno' });
      });
    });

    describe('with an unnamed value', () => {
      it('returns a native representation', () => {
        const unnamedValue = new EnoValue(context, instructionUnnamedValue, parent);
        expect(unnamedValue.raw()).toEqual('eno');
      });
    });
  });

  describe('toString()', () => {
    describe('with a name and a value', () => {
      it('returns a debug abstraction', () => {
        expect(value.toString()).toEqual('[object EnoValue name="language" value="eno"]');
      });
    });

    describe('with a name and a long value', () => {
      it('returns a debug abstraction with a truncated value', () => {
        const unnamedLongValue = new EnoValue(context, instructionUnnamedLongValue, parent);
        expect(unnamedLongValue.toString()).toEqual('[object EnoValue value="The languag..."]');
      });
    });

    describe('with a name and no value', () => {
      it('returns a debug abstraction', () => {
        const namedEmptyValue = new EnoValue(context, instructionNamedEmpty, parent);
        expect(namedEmptyValue.toString()).toEqual('[object EnoValue name="language" value=null]');
      });
    });

    describe('with an unnamed value', () => {
      it('returns a debug abstraction', () => {
        const unnamedValue = new EnoValue(context, instructionUnnamedValue, parent);
        expect(unnamedValue.toString()).toEqual('[object EnoValue value="eno"]');
      });
    });

    describe('with no name and value', () => {
      it('returns a debug abstraction', () => {
        const voidValue = new EnoValue(context, instructionVoid, parent);
        expect(voidValue.toString()).toEqual('[object EnoValue value=null]');
      });
    });
  });

  describe('toStringTag symbol', () => {
    it('returns a custom tag', () => {
      expect(Object.prototype.toString.call(value)).toEqual('[object EnoValue]');
    });
  });

  describe('value()', () => {
    it('returns the value', () => {
      expect(value.value()).toEqual('eno');
    });

    it('touches the element', () => {
      const _ = value.value();
      expect(value.touched).toBe(true);
    });

    describe('with a loader function', () => {
      it('applies the loader', () => {
        const result = value.value(({ value }) => value.toUpperCase());
        expect(result).toEqual('ENO');
      });

      it('touches the element', () => {
        const _ = value.value(({ value }) => value.toUpperCase());
        expect(value.touched).toBe(true);
      });
    });

    describe("'required' alias for 'enforceValue'", () => {
      let emptyValue;

      beforeEach(() => {
        const input = `
          language:
          |
        `;

        emptyValue = eno.parse(input).element('language');
      });

      describe('when not set', () => {
        it('returns null', () => {
          expect(emptyValue.value()).toBe(null);
        });
      });

      describe('when set to true', () => {
        it('throws an error', () => {
          expect(() => emptyValue.value({ required: true })).toThrowErrorMatchingSnapshot();
        });
      });
    });
  });
});
