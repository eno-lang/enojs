const { parse } = require('../../eno.js');

const input = `
languages:
> eno-lang.org
- eno
> json.org
- json

copy < languages
> yaml.org
- yaml
`.trim();

describe('Resolution', () => {
  describe('Copying list with comments', () => {
    it('works', () => {
      const doc = parse(input);
      expect(doc.raw()).toMatchSnapshot();
    });
  });
});
