const analyze = require('./analyze_helper.js');

const input = `
Field: Value
\\ Line continuation
| Newline continuation

Fieldset:
Empty = Value
\\ Line continuation
| Newline continuation

List:
- Value
\\ Line continuation
| Newline continuation

Empty field:
\\ Line continuation
| Newline continuation

Fieldset with empty entry:
Empty entry =
\\ Line continuation
| Newline continuation

List with empty item:
-
\\ Line continuation
| Newline continuation
`.trim();

describe('Continuation analysis', () => {
  it('performs to specification', () => {
    expect(analyze(input)).toMatchSnapshot();
  });
});
