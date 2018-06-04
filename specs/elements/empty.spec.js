const EnoEmpty = require('../../lib/elements/empty.js');

const fabricate = () => {
  const context = {};
  const instruction = { name: 'language' };

  return new EnoEmpty(context, instruction);
}

describe('EnoEmpty', () => {

  test('is untouched after initialization', () => {
    const empty = fabricate();
    expect(empty.touched).toBe(false);
  });

  describe('raw()', () => {

    test('returns the primitive object representation', () => {
      const empty = fabricate();
      expect(empty.raw()).toEqual({ language: null });
    });

  });

  describe('toString()', () => {

    test('returns a debug abstraction', () => {
      const empty = fabricate();
      expect(empty.toString()).toEqual('[object EnoEmpty name="language"]');
    });

  });

  describe('toStringTag symbol', () => {

    test('returns a custom tag', () => {
      const empty = fabricate();
      expect(Object.prototype.toString.call(empty)).toEqual('[object EnoEmpty]');
    });

  });

  describe('touch()', () => {

    test('touches the element', () => {
      const empty = fabricate();
      empty.touch();
      expect(empty.touched).toBe(true);
    });

  });

  describe('value()', () => {

    test('returns null', () => {
      const empty = fabricate();
      expect(empty.value()).toBe(null);
    });

    test('touches the element', () => {
      const empty = fabricate();
      const _ = empty.value();
      expect(empty.touched).toBe(true);
    });
  });
});
