const eno = require('../../eno.js');
const EnoSection = require('../../lib/elements/section.js');

const context = {};
const instruction = {
  subinstructions: []
};
const parent = null;

describe('EnoSection', () => {
  let section;

  beforeEach(() => {
    section = new EnoSection(context, instruction, parent);
  });

  describe('toStringTag symbol', () => {
    it('returns a custom tag', () => {
      expect(Object.prototype.toString.call(section)).toEqual('[object EnoSection]');
    });
  });
});
