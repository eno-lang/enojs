const eno = require('../../eno.js');

const input = `
Field: Value
\\ Line continuation
| Newline continuation

Dictionary:
Entry = Value
\\ Line continuation
| Newline continuation

List:
- Value
\\ Line continuation
| Newline continuation

Empty field:
\\ Line continuation
| Newline continuation

Dictionary with empty entry:
Empty entry =
\\ Line continuation
| Newline continuation

List with empty item:
-
\\ Line continuation
| Newline continuation
`.trim();

describe('Blackbox test', () => {
  describe('Continuations', () => {
    it('performs as expected', () => {
      expect(eno.parse(input).raw()).toMatchSnapshot();
    });
  });
});
