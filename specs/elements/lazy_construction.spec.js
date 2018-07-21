const eno = require('../../eno.js');
const EnoFieldset = require('../../lib/elements/fieldset.js');
const EnoList = require('../../lib/elements/list.js');
const EnoValue = require('../../lib/elements/value.js');

describe('Fetching an empty element through fieldset()', () => {
  const document = eno.parse('languages:');
  const fieldset = document.fieldset('languages');

  it('returns a fieldset', () => {
    expect(fieldset instanceof EnoFieldset).toBe(true);
  });

  it('returns a fieldset with enforceAllElements disabled', () => {
    expect(fieldset._enforceAllElements).toBe(false);
  });

  describe('when enforceAllElements was enabled on the document', () => {
    document.enforceAllElements();
    const fieldset = document.fieldset('languages');

    it('returns a fieldset with enforceAllElements enabled', () => {
      expect(fieldset._enforceAllElements).toBe(true);
    });
  });
});

describe('Fetching an empty element through fieldsets()', () => {
  const document = eno.parse('languages:');
  const fieldsets = document.fieldsets('languages');

  it('returns one element', () => {
    expect(fieldsets.length).toBe(1);
  });

  it('returns a fieldset as first element', () => {
    expect(fieldsets[0] instanceof EnoFieldset).toBe(true);
  });

  it('returns a fieldset with enforceAllElements disabled', () => {
    expect(fieldsets[0]._enforceAllElements).toBe(false);
  });

  describe('when enforceAllElements was enabled on the document', () => {
    document.enforceAllElements();
    const fieldsets = document.fieldsets('languages');

    it('returns a fieldset with enforceAllElements enabled', () => {
      expect(fieldsets[0]._enforceAllElements).toBe(true);
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
