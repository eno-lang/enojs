const EnoValue = require('../../lib/elements/value.js');

const fabricate = () => {
  const context = {};
  const instruction = { name: 'language', value: 'eno' };

  return new EnoValue(context, instruction);
}

describe('EnoValue', () => {

  test('is untouched after initialization', () => {
    const enoValue = fabricate();
    expect(enoValue.touched).toBe(false);
  });

  describe('value()', () => {

    test('returns the value', () => {
      const enoValue = fabricate();
      expect(enoValue.value()).toEqual('eno');
    });

    test('touches the element', () => {
      const enoValue = fabricate();
      const _ = enoValue.value();
      expect(enoValue.touched).toBe(true);
    });

    describe('with loader function', () => {

      test('applies the loader', () => {
        const enoValue = fabricate();
        const result = enoValue.value(({ value }) => value.toUpperCase());
        expect(result).toEqual('ENO');
      });

      test('touches the element', () => {
        const enoValue = fabricate();
        const _ = enoValue.value(({ value }) => value.toUpperCase());
        expect(enoValue.touched).toBe(true);
      });

    });
  });
});
