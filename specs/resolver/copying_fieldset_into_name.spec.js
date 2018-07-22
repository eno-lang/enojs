const { parse } = require('../../eno.js');

const input = `
languages:
eno = eno notation
json = json object notation

copy < languages
`.trim();

describe('Resolution', () => {
  describe('Copying fieldset into name', () => {
    it('works', () => {
      const doc = parse(input);
      expect(doc.raw()).toMatchSnapshot();
    });
  });
});
