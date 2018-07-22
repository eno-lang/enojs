const { parse } = require('../../eno.js');

const input = `
languages:
eno = error notation
json = json object notation

copy < languages
eno = eno notation
`.trim();

describe('Resolution', () => {
  describe('Copying fieldset into fieldset', () => {
    it('works', () => {
      const doc = parse(input);
      expect(doc.raw()).toMatchSnapshot();
    });
  });
});
