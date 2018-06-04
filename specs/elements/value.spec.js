const EnoValue = require('../../lib/elements/value.js');

const context = {};
const instruction = { name: 'language', value: 'eno' };
const instructionNamedEmpty = { name: 'language', value: null };
const instructionUnnamedValue = { value: 'eno' };
const instructionVoid = {};
const parent = {};

describe('EnoValue', () => {

  let value;

  beforeEach(() => {
    value = new EnoValue(context, instruction, parent);
  });

  test('is untouched after initialization', () => {
    expect(value.touched).toBe(false);
  });

  describe('toString()', () => {
    describe('with a name and a value', () => {
      it('returns a debug abstraction', () => {
        expect(value.toString()).toEqual('[Object EnoValue name="language" value="eno"]');
      });
    });

    describe('with a name and no value', () => {
      it('returns a debug abstraction', () => {
        const namedEmptyValue = new EnoValue(context, instructionNamedEmpty, parent);
        expect(namedEmptyValue.toString()).toEqual('[Object EnoValue name="language" value=null]');
      });
    });

    describe('with an unnamed value', () => {
      it('returns a debug abstraction', () => {
        const unnamedValue = new EnoValue(context, instructionUnnamedValue, parent);
        expect(unnamedValue.toString()).toEqual('[Object EnoValue value="eno"]');
      });
    });

    describe('with no name and value', () => {
      it('returns a debug abstraction', () => {
        const voidValue = new EnoValue(context, instructionVoid, parent);
        expect(voidValue.toString()).toEqual('[Object EnoValue value=null]');
      });
    });
  });

  describe('value()', () => {

    test('returns the value', () => {
      expect(value.value()).toEqual('eno');
    });

    test('touches the element', () => {
      const _ = value.value();
      expect(value.touched).toBe(true);
    });

    describe('with loader function', () => {

      test('applies the loader', () => {
        const result = value.value(({ value }) => value.toUpperCase());
        expect(result).toEqual('ENO');
      });

      test('touches the element', () => {
        const _ = value.value(({ value }) => value.toUpperCase());
        expect(value.touched).toBe(true);
      });

    });
  });
});
