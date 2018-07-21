const eno = require('enojs');

const input = `
field: value

list:
- value
- value

fieldset:
entry = value
`.trim();

describe('string alias pseudo loader', () => {
  let document;

  beforeAll(() => {
    document = eno.parse(input);
  });

  describe('as Fieldset entry proxy', () => {
    it('returns the value unaltered', () => {
      expect(document.fieldset('fieldset').string('entry')).toBe('value');
    });
  });

  describe('as List items proxy', () => {
    it('returns the values unaltered', () => {
      const values = document.element('list').stringItems();

      for(let value of values) {
        expect(value).toBe('value');
      }
    });
  });

  describe('as Section field proxy', () => {
    it('returns the value unaltered', () => {
      expect(document.string('field')).toBe('value');
    });
  });

  describe('as Section list proxy', () => {
    it('returns the values unaltered', () => {
      const values = document.stringList('list');

      for(let value of values) {
        expect(value).toBe('value');
      }
    });
  });

  describe('as Value value proxy', () => {
    it('returns the value unaltered', () => {
      expect(document.element('field').string()).toBe('value');
    });
  });
});
