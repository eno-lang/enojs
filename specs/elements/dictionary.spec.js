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

  it('has globallyEnforceElements disabled by default', () => {
    expect(dictionary.globallyEnforceElements).toBe(false);
  });

  describe('entry()', () => {

    it('returns a value', () => {
      expect(dictionary.entry('eno')).toEqual('eno notation');
    });

    it('touches the dictionary', () => {
      const _ = dictionary.entry('eno');
      expect(dictionary.touched).toBe(true);
    });

    it('touches the entry', () => {
      const _ = dictionary.entry('eno');
      expect(dictionary.entries['eno'].touched).toBe(true);
    });

    describe('with loader function', () => {

      it('applies the loader', () => {
        const result = dictionary.entry('eno', ({ value }) => value.toUpperCase());
        expect(result).toEqual('ENO NOTATION');
      });

      it('touches the element', () => {
        const _ = dictionary.entry('eno', ({ value }) => value.toUpperCase());
        expect(dictionary.touched).toBe(true);
      });

      it('touches the entry', () => {
        const _ = dictionary.entry('eno', ({ value }) => value.toUpperCase());
        expect(dictionary.entries['eno'].touched).toBe(true);
      });

    });
  });

  describe('raw()', () => {

    it('returns the primitive object representation', () => {
      expect(dictionary.raw()).toEqual({
        'languages': {
          'eno': 'eno notation',
          'json': 'JavaScript Object Notation',
          'yaml': "YAML Ain't Markup Language",
        }
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
