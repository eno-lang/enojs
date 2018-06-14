const eno = require('../../eno.js');
const EnoDictionary = require('../../lib/elements/dictionary.js');
const EnoList = require('../../lib/elements/list.js');
const EnoValue = require('../../lib/elements/value.js');

describe('Fetching an empty element through dictionary()', () => {
  const document = eno.parse('languages:');
  const dictionary = document.dictionary('languages');

  it('returns a dictionary', () => {
    expect(dictionary instanceof EnoDictionary).toBe(true);
  });

  it('returns a dictionary with enforceAllElements disabled', () => {
    expect(dictionary._enforceAllElements).toBe(false);
  });

  describe('when enforceAllElements was enabled on the document', () => {
    document.enforceAllElements();
    const dictionary = document.dictionary('languages');

    it('returns a dictionary with enforceAllElements enabled', () => {
      expect(dictionary._enforceAllElements).toBe(true);
    });
  });
});

describe('Fetching an empty element through dictionaries()', () => {
  const document = eno.parse('languages:');
  const dictionaries = document.dictionaries('languages');

  it('returns one element', () => {
    expect(dictionaries.length).toBe(1);
  });

  it('returns a dictionary as first element', () => {
    expect(dictionaries[0] instanceof EnoDictionary).toBe(true);
  });

  it('returns a dictionary with enforceAllElements disabled', () => {
    expect(dictionaries[0]._enforceAllElements).toBe(false);
  });

  describe('when enforceAllElements was enabled on the document', () => {
    document.enforceAllElements();
    const dictionaries = document.dictionaries('languages');

    it('returns a dictionary with enforceAllElements enabled', () => {
      expect(dictionaries[0]._enforceAllElements).toBe(true);
    });
  });
});

describe('Fetching an empty element through fields()', () => {
  const document = eno.parse('languages:');
  const fields = document.fields('languages');

  it('returns one element', () => {
    expect(fields.length).toBe(1);
  });

  it('returns a field as first element', () => {
    expect(fields[0] instanceof EnoValue).toBe(true);
  });
});

describe('Fetching an empty element through lists()', () => {
  const document = eno.parse('languages:');
  const lists = document.lists('languages');

  it('returns one element', () => {
    expect(lists.length).toBe(1);
  });

  it('returns a list as first element', () => {
    expect(lists[0] instanceof EnoList).toBe(true);
  });
});
