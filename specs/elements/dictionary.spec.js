const eno = require('../../eno.js');
const EnoDictionary = require('../../lib/elements/dictionary.js');
const EnoValue = require('../../lib/elements/value.js');

const context = {};
const instruction = {
  name: 'languages',
  subinstructions: [{
    type: 'EMPTY_LINE'
  }, {
    name: 'eno',
    type: 'DICTIONARY_ENTRY',
    value: 'eno notation'
  }, {
    name: 'json',
    type: 'DICTIONARY_ENTRY',
    value: 'JavaScript Object Notation'
  }, {
    name: 'yaml',
    type: 'DICTIONARY_ENTRY',
    value: "YAML Ain't Markup Language"
  }]
};
const parent = {};

describe('EnoDictionary', () => {
  let dictionary;

  beforeEach(() => {
    dictionary = new EnoDictionary(context, instruction, parent);
  });

  it('is untouched after initialization', () => {
    expect(dictionary.touched).toBe(false);
  });

  it('has only untouched entries after initialization', () => {
    for(let entry of dictionary.entries()) {
      expect(entry.touched).toBe(false);
    }
  });

  it('has enforceAllElements disabled by default', () => {
    expect(dictionary._enforceAllElements).toBe(false);
  });

  describe('element()', () => {
    describe('fetching an existing element', () => {
      beforeEach(() => {
        result = dictionary.element('eno');
      });

      it('returns an element', () => {
        expect(result instanceof EnoValue).toBe(true);
      });

      it('returns the right element', () => {
        expect(result.name).toEqual('eno');
      });
    });

    describe('fetching a missing element', () => {
      it('throws an error', () => {
        expect(() => eno.parse('languages:').dictionary('languages').element('missing')).toThrowErrorMatchingSnapshot();
      });

      describe('with { enforceElement: false }', () => {
        it('returns null', () => {
          expect(dictionary.element('missing', { required: false })).toBeNull();
        });
      });

      describe('with { required: false }', () => {
        it('returns null', () => {
          expect(dictionary.element('missing', { required: false })).toBeNull();
        });
      });
    });
  });

  describe('enforceAllElements()', () => {
    it('sets the _enforceAllElements property to true', () => {
      dictionary.enforceAllElements();
      expect(dictionary._enforceAllElements).toBe(true);
    });

    describe('passing true explicitly', () => {
      it('sets the _enforceAllElements property to true', () => {
        dictionary.enforceAllElements(true);
        expect(dictionary._enforceAllElements).toBe(true);
      });
    });

    describe('passing false explicitly', () => {
      it('sets the _enforceAllElements property back to false', () => {
        dictionary.enforceAllElements(true);
        dictionary.enforceAllElements(false);
        expect(dictionary._enforceAllElements).toBe(false);
      });
    });
  });

  describe('entry()', () => {
    describe('without a loader', () => {
      let result;

      beforeEach(() => {
        result = dictionary.entry('eno');
      });

      it('returns a value', () => {
        expect(result).toEqual('eno notation');
      });

      it('touches the dictionary', () => {
        expect(dictionary.touched).toBe(true);
      });

      it('touches the entry', () => {
        expect(dictionary.entries_associative['eno'].touched).toBe(true);
      });

      it('does not touch the other entries', () => {
        for(let entry of dictionary.entries()) {
          if(entry.name !== 'eno') {
            expect(entry.touched).toBe(false);
          }
        }
      });
    });

    describe('with loader', () => {
      let result;

      beforeEach(() => {
        result =  dictionary.entry('eno', ({ value }) => value.toUpperCase());
      });

      it('applies the loader', () => {
        expect(result).toEqual('ENO NOTATION');
      });

      it('touches the element', () => {
        expect(dictionary.touched).toBe(true);
      });

      it('touches the entry', () => {
        expect(dictionary.entries_associative['eno'].touched).toBe(true);
      });

      it('does not touch the other entries', () => {
        for(let entry of dictionary.entries()) {
          if(entry.name !== 'eno') {
            expect(entry.touched).toBe(false);
          }
        }
      });
    });
  });

  describe('raw()', () => {
    it('returns a native object representation', () => {
      expect(dictionary.raw()).toEqual({
        'languages': [
          { 'eno': 'eno notation' },
          { 'json': 'JavaScript Object Notation' },
          { 'yaml': "YAML Ain't Markup Language" }
        ]
      });
    });
  });

  describe('toString()', () => {
    it('returns a debug abstraction', () => {
      expect(dictionary.toString()).toEqual('[object EnoDictionary name="languages" entries=3]');
    });
  });

  describe('toStringTag symbol', () => {
    it('returns a custom tag', () => {
      expect(Object.prototype.toString.call(dictionary)).toEqual('[object EnoDictionary]');
    });
  });

  describe('touch()', () => {
    describe('without options', () => {
      beforeEach(() => {
        dictionary.touch();
      });

      it('touches the dictionary', () => {
        expect(dictionary.touched).toBe(true);
      });

      it('does not touch the entries', () => {
        for(let entry of dictionary.entries()) {
          expect(entry.touched).toBe(false);
        }
      });
    });

    describe('with { entries: true }', () => {
      beforeEach(() => {
        dictionary.touch({ entries: true });
      });

      it('touches the dictionary', () => {
        expect(dictionary.touched).toBe(true);
      });

      it('touches the entries', () => {
        for(let entry of dictionary.entries()) {
          expect(entry.touched).toBe(true);
        }
      });
    });
  });
});
