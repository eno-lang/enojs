const eno = require('../../eno.js');
const Field = require('../../lib/elements/field.js');
const Fieldset = require('../../lib/elements/fieldset.js');

const context = {};
const instruction = {
  name: 'languages',
  subinstructions: [{
    type: 'NOOP'
  }, {
    name: 'eno',
    type: 'FIELDSET_ENTRY',
    value: 'eno notation'
  }, {
    name: 'json',
    type: 'FIELDSET_ENTRY',
    value: 'JavaScript Object Notation'
  }, {
    name: 'yaml',
    type: 'FIELDSET_ENTRY',
    value: "YAML Ain't Markup Language"
  }]
};
const parent = {};

describe('Fieldset', () => {
  let fieldset;

  beforeEach(() => {
    fieldset = new Fieldset(context, instruction, parent);
  });

  it('is untouched after initialization', () => {
    expect(fieldset.touched).toBe(false);
  });

  it('has only untouched entries after initialization', () => {
    for(let entry of fieldset.entries()) {
      expect(entry.touched).toBe(false);
    }
  });

  it('has enforceAllElements disabled by default', () => {
    expect(fieldset._enforceAllElements).toBe(false);
  });

  describe('element()', () => {
    describe('fetching an existing element', () => {
      beforeEach(() => {
        result = fieldset.element('eno');
      });

      it('returns an element', () => {
        expect(result instanceof Field).toBe(true);
      });

      it('returns the right element', () => {
        expect(result.name).toEqual('eno');
      });
    });

    describe('fetching a missing element', () => {
      it('throws an error', () => {
        expect(() => eno.parse('languages:').fieldset('languages').element('missing')).toThrowErrorMatchingSnapshot();
      });

      describe('with { enforceElement: false }', () => {
        it('returns null', () => {
          expect(fieldset.element('missing', { required: false })).toBeNull();
        });
      });

      describe('with { required: false }', () => {
        it('returns null', () => {
          expect(fieldset.element('missing', { required: false })).toBeNull();
        });
      });
    });
  });

  describe('enforceAllElements()', () => {
    it('sets the _enforceAllElements property to true', () => {
      fieldset.enforceAllElements();
      expect(fieldset._enforceAllElements).toBe(true);
    });

    describe('passing true explicitly', () => {
      it('sets the _enforceAllElements property to true', () => {
        fieldset.enforceAllElements(true);
        expect(fieldset._enforceAllElements).toBe(true);
      });
    });

    describe('passing false explicitly', () => {
      it('sets the _enforceAllElements property back to false', () => {
        fieldset.enforceAllElements(true);
        fieldset.enforceAllElements(false);
        expect(fieldset._enforceAllElements).toBe(false);
      });
    });
  });

  describe('entry()', () => {
    describe('without a loader', () => {
      let result;

      beforeEach(() => {
        result = fieldset.entry('eno');
      });

      it('returns a value', () => {
        expect(result).toEqual('eno notation');
      });

      it('touches the fieldset', () => {
        expect(fieldset.touched).toBe(true);
      });

      it('touches the entry', () => {
        expect(fieldset.entries_associative['eno'].touched).toBe(true);
      });

      it('does not touch the other entries', () => {
        for(let entry of fieldset.entries()) {
          if(entry.name !== 'eno') {
            expect(entry.touched).toBe(false);
          }
        }
      });
    });

    describe('with a loader', () => {
      let result;

      beforeEach(() => {
        result =  fieldset.entry('eno', ({ value }) => value.toUpperCase());
      });

      it('applies the loader', () => {
        expect(result).toEqual('ENO NOTATION');
      });

      it('touches the element', () => {
        expect(fieldset.touched).toBe(true);
      });

      it('touches the entry', () => {
        expect(fieldset.entries_associative['eno'].touched).toBe(true);
      });

      it('does not touch the other entries', () => {
        for(let entry of fieldset.entries()) {
          if(entry.name !== 'eno') {
            expect(entry.touched).toBe(false);
          }
        }
      });
    });

    describe('with { element: true }', () => {
      it('returns the element', () => {
        const result = fieldset.entry('eno', { element: true });
        expect(result instanceof Field).toBe(true);
      });
    });

    describe('with { withElement: true }', () => {
      describe('when the entry exists', () => {
        let result;

        beforeEach(() => {
          result = fieldset.entry('eno', { withElement: true });
        });

        it('returns the element', () => {
          expect(result.element instanceof Field).toBe(true);
        });

        it('returns the value', () => {
          expect(result.value).toEqual('eno notation');
        });
      });

      describe('when the entry does not exist', () => {
        let result;

        beforeEach(() => {
          result = fieldset.entry('missing', { withElement: true });
        });

        it('returns the element', () => {
          expect(result.element).toBe(null);
        });

        it('returns the value', () => {
          expect(result.value).toBe(null);
        });
      });
    });
  });

  describe('raw()', () => {
    it('returns a native object representation', () => {
      expect(fieldset.raw()).toEqual({
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
      expect(fieldset.toString()).toEqual('[object Fieldset name="languages" entries=3]');
    });
  });

  describe('toStringTag symbol', () => {
    it('returns a custom tag', () => {
      expect(Object.prototype.toString.call(fieldset)).toEqual('[object Fieldset]');
    });
  });

  describe('touch()', () => {
    describe('without options', () => {
      beforeEach(() => {
        fieldset.touch();
      });

      it('touches the fieldset', () => {
        expect(fieldset.touched).toBe(true);
      });

      it('does not touch the entries', () => {
        for(let entry of fieldset.entries()) {
          expect(entry.touched).toBe(false);
        }
      });
    });

    describe('with { entries: true }', () => {
      beforeEach(() => {
        fieldset.touch({ entries: true });
      });

      it('touches the fieldset', () => {
        expect(fieldset.touched).toBe(true);
      });

      it('touches the entries', () => {
        for(let entry of fieldset.entries()) {
          expect(entry.touched).toBe(true);
        }
      });
    });
  });
});
