const eno = require('../../eno.js');
const Section = require('../../lib/elements/section.js');

const context = {};
const instruction = {
  depth: 0,
  index: 0,
  length: 0,
  line: 1,
  name: '<>#:=|\\_ENO_DOCUMENT',
  ranges: {
    sectionOperator: [0, 0],
    name: [0, 0]
  },
  subinstructions: []
};
const parent = null;

describe('Section', () => {
  let section;

  beforeEach(() => {
    section = new Section(context, instruction, parent);
  });

  describe('elements()', () => {
    let result;

    beforeEach(() => {
      result = section.elements();
    });

    it('touches the section', () => {
      expect(section.touched).toBe(true);
    });

    it('returns the elements of the section', () => {
      expect(result).toEqual([]);
    });
  });

  describe('toString()', () => {
    it('returns a debug abstraction', () => {
      expect(section.toString()).toEqual('[object Section document elements=0]');
    });
  });

  describe('toStringTag symbol', () => {
    it('returns a custom tag', () => {
      expect(Object.prototype.toString.call(section)).toEqual('[object Section]');
    });
  });
});
