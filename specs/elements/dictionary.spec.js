const EnoDictionary = require('../../lib/elements/dictionary.js');

const fabricate = () => {
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

  return new EnoDictionary(context, instruction);
}

describe('EnoDictionary', () => {

  test('is untouched after initialization', () => {
    const enoDictionary = fabricate();
    expect(enoDictionary.touched).toBe(false);
  });

  test('has only untouched entries after initialization', () => {
    const enoDictionary = fabricate();
    expect(Object.values(enoDictionary.entries).map(entry => entry.touched)).toEqual([false, false, false]);
  });

  describe('entry()', () => {

    test('returns a value', () => {
      const enoDictionary = fabricate();
      expect(enoDictionary.entry('eno')).toEqual('eno notation');
    });

    test('touches the dictionary', () => {
      const enoDictionary = fabricate();
      const _ = enoDictionary.entry('eno');
      expect(enoDictionary.touched).toBe(true);
    });

    test('touches the entry', () => {
      const enoDictionary = fabricate();
      const _ = enoDictionary.entry('eno');
      expect(enoDictionary.entries['eno'].touched).toBe(true);
    });

    describe('with loader function', () => {

      test('applies the loader', () => {
        const enoDictionary = fabricate();
        const result = enoDictionary.entry('eno', ({ value }) => value.toUpperCase());
        expect(result).toEqual('ENO NOTATION');
      });

      test('touches the element', () => {
        const enoDictionary = fabricate();
        const _ = enoDictionary.entry('eno', ({ value }) => value.toUpperCase());
        expect(enoDictionary.touched).toBe(true);
      });

      test('touches the entry', () => {
        const enoDictionary = fabricate();
        const _ = enoDictionary.entry('eno', ({ value }) => value.toUpperCase());
        expect(enoDictionary.entries['eno'].touched).toBe(true);
      });

    });
  });

  describe('raw()', () => {

    test('returns the primitive object representation', () => {
      const enoDictionary = fabricate();
      expect(enoDictionary.raw()).toEqual({
        'languages': {
          'eno': 'eno notation',
          'json': 'JavaScript Object Notation',
          'yaml': "YAML Ain't Markup Language",
        }
      });
    });

  });

  describe('toString()', () => {

    test('returns a debug abstraction', () => {
      const enoDictionary = fabricate();
      expect(enoDictionary.toString()).toEqual('[Object EnoDictionary name="languages" length="3"]');
    });

  });

  describe('toStringTag symbol', () => {

    test('returns a custom tag', () => {
      const enoDictionary = fabricate();
      expect(Object.prototype.toString.call(enoDictionary)).toEqual('[object EnoDictionary]');
    });

  });

  describe('touch()', () => {

    test('touches the dictionary', () => {
      const enoDictionary = fabricate();
      enoDictionary.touch();
      expect(enoDictionary.touched).toBe(true);
    });

  });
});
