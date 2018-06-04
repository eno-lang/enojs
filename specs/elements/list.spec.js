const EnoList = require('../../lib/elements/list.js');

const fabricate = () => {
  const context = {};
  const instruction = {
    name: 'languages',
    subinstructions: [{
      type: 'LIST_ITEM',
      value: 'eno'
    }, {
      type: 'LIST_ITEM',
      value: 'json'
    }, {
      type: 'LIST_ITEM',
      value: 'yaml'
    }]
  };

  return new EnoList(context, instruction);
}

describe('EnoList', () => {

  test('is untouched after initialization', () => {
    const enoList = fabricate();
    expect(enoList.touched).toBe(false);
  });

  test('has only untouched items after initialization', () => {
    const enoList = fabricate();
    expect(enoList._items.map(item => item.touched)).toEqual([false, false, false]);
  });

  describe('items()', () => {

    test('returns the values', () => {
      const enoList = fabricate();
      expect(enoList.items()).toEqual(['eno', 'json', 'yaml']);
    });

    test('touches the list itself', () => {
      const enoList = fabricate();
      const _ = enoList.items();
      expect(enoList.touched).toBe(true);
    });

    test('touches all list items', () => {
      const enoList = fabricate();
      const _ = enoList.items();
      expect(enoList._items.map(item => item.touched)).toEqual([true, true, true]);
    });

    describe('with loader function', () => {

      test('applies the loader', () => {
        const enoList = fabricate();
        const result = enoList.items(({ value }) => value.toUpperCase());
        expect(result).toEqual(['ENO', 'JSON', 'YAML']);
      });

      test('touches the element', () => {
        const enoList = fabricate();
        const _ = enoList.items(({ value }) => value.toUpperCase());
        expect(enoList.touched).toBe(true);
      });

      test('touches all list items', () => {
        const enoList = fabricate();
        const _ = enoList.items(({ value }) => value.toUpperCase());
        expect(enoList._items.map(item => item.touched)).toEqual([true, true, true]);
      });

    });
  });

  describe('raw()', () => {

    test('returns the primitive object representation', () => {
      const enoList = fabricate();
      expect(enoList.raw()).toEqual({ languages: ['eno', 'json', 'yaml'] });
    });

  });

  describe('toString()', () => {

    test('returns a debug abstraction', () => {
      const enoList = fabricate();
      expect(enoList.toString()).toEqual('[object EnoList name="languages" length="3"]');
    });

  });

  describe('toStringTag symbol', () => {

    test('returns a custom tag', () => {
      const enoList = fabricate();
      expect(Object.prototype.toString.call(enoList)).toEqual('[object EnoList]');
    });

  });

  describe('touch()', () => {

    const enoList = fabricate();
    enoList.touch();

    test('touches the list itself', () => {
      expect(enoList.touched).toBe(true);
    });

    test('touches all list items', () => {
      expect(enoList._items.map(item => item.touched)).toEqual([true, true, true]);
    });

  });
});
