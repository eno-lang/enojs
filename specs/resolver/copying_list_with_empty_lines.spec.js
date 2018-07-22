const { parse } = require('../../eno.js');

const input = `
languages:

- eno

- json

copy < languages

- yaml
`.trim();

describe('Resolution', () => {
  describe('Copying list with empty lines', () => {
    it('works', () => {
      const doc = parse(input);
      expect(doc.raw()).toMatchSnapshot();
    });
  });
});
