const EnoDictionary = require('../../lib/elements/dictionary.js');

const context = {};
const instruction = {
  name: 'languages',
  subinstructions: [{
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
    it('touches the dictionary', () => {
      dictionary.touch();
      expect(dictionary.touched).toBe(true);
    });

    it('does not touch the entries', () => {
      for(let entry of dictionary.entries()) {
        if(entry.name !== 'eno') {
          expect(entry.touched).toBe(false);
        }
      }
    });
  });
});
