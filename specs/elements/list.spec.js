const Field = require('../../lib/elements/field.js');
const List = require('../../lib/elements/list.js');

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
const parent = {};

describe('List', () => {
  let list;

  beforeEach(() => {
    list = new List(context, instruction, parent);
  });

  it('is untouched after initialization', () => {
    expect(list.touched).toBe(false);
  });

  it('has only untouched items after initialization', () => {
    for(let item of list.elements()) {
      expect(item.touched).toBe(false);
    }
  });

  describe('elements()', () => {
    let result;

    beforeEach(() => {
      result = list.elements();
    });

    it('touches the list itself', () => {
      expect(list.touched).toBe(true);
    });

    it('does not touch the list items', () => {
      for(let item of list.items({ elements: true })) {
        expect(item.touched).toBe(false);
      }
    });
  });

  describe('items()', () => {
    let result;

    describe('without a loader', () => {
      beforeEach(() => {
        result = list.items();
      });

      it('returns the values', () => {
        expect(result).toEqual(['eno', 'json', 'yaml']);
      });

      it('touches the list itself', () => {
        expect(list.touched).toBe(true);
      });

      it('touches all list items', () => {
        for(let item of list.elements()) {
          expect(item.touched).toBe(true);
        }
      });
    });

    describe('with a loader', () => {
      beforeEach(() => {
        result = list.items(({ value }) => value.toUpperCase());
      });

      it('returns the processed values', () => {
        expect(result).toEqual(['ENO', 'JSON', 'YAML']);
      });

      it('touches the element', () => {
        expect(list.touched).toBe(true);
      });

      it('touches all list items', () => {
        for(let item of list.elements()) {
          expect(item.touched).toBe(true);
        }
      });
    });

    describe('with { withElements: true }', () => {
      beforeEach(() => {
        result = list.items({ withElements: true });
      });

      it('returns the elements', () => {
        for(let item of result) {
          expect(item.element instanceof Field).toBe(true);
        }
      });

      it('returns the values', () => {
        expect(result.map(item => item.value)).toEqual(['eno', 'json', 'yaml']);
      });
    });
  });

  describe('length()', () => {
    it('returns the number of items', () => {
      expect(list.length()).toBe(3);
    });
  });

  describe('raw()', () => {
    it('returns a native object representation', () => {
      expect(list.raw()).toEqual({ languages: ['eno', 'json', 'yaml'] });
    });
  });

  describe('toString()', () => {
    it('returns a debug abstraction', () => {
      expect(list.toString()).toEqual('[object List name="languages" items=3]');
    });
  });

  describe('toStringTag symbol', () => {
    it('returns a custom tag', () => {
      expect(Object.prototype.toString.call(list)).toEqual('[object List]');
    });
  });

  describe('touch()', () => {
    describe('without options', () => {
      beforeEach(() => {
        list.touch();
      });

      it('touches the list itself', () => {
        expect(list.touched).toBe(true);
      });

      it('does not touch the list items', () => {
        for(let item of list.elements()) {
          expect(item.touched).toBe(false);
        }
      });
    });

    describe('with { items: true }', () => {
      beforeEach(() => {
        list.touch({ items: true });
      });

      it('touches the list itself', () => {
        expect(list.touched).toBe(true);
      });

      it('touches the list items', () => {
        for(let item of list.elements()) {
          expect(item.touched).toBe(true);
        }
      });
    });
  });
});
