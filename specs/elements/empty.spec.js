const Empty = require('../../lib/elements/empty.js');

const CONTEXT = {};
const INSTRUCTION = { name: 'language' };
const PARENT = {};

describe('Empty', () => {
  beforeEach(() => {
    empty = new Empty(CONTEXT, INSTRUCTION, PARENT);
  });

  it('is untouched after initialization', () => {
    expect(empty.touched).toBe(false);
  });

  describe('raw()', () => {
    it('returns a native object representation', () => {
      expect(empty.raw()).toEqual({ language: null });
    });
  });

  describe('toString()', () => {
    it('returns a debug abstraction', () => {
      expect(empty.toString()).toEqual('[object Empty name="language"]');
    });
  });

  describe('toStringTag symbol', () => {
    it('returns a custom tag', () => {
      expect(Object.prototype.toString.call(empty)).toEqual('[object Empty]');
    });
  });

  describe('touch()', () => {
    it('touches the element', () => {
      empty.touch();
      expect(empty.touched).toBe(true);
    });
  });

  describe('value()', () => {
    it('returns null', () => {
      expect(empty.value()).toBe(null);
    });

    it('touches the element', () => {
      const _ = empty.value();
      expect(empty.touched).toBe(true);
    });
  });
});
