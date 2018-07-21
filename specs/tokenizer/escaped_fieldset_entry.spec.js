const tokenize = require('../../lib/parse_steps/tokenize.js');

const input = `
\`name\` =

\`\`na\`me\`\` =

\`\`\`na\`\`me\`\`\`    =

    \`\` \`name\` \`\`    =

\`name\` =
`.trim();

describe('Escaped fieldset entry tokenization', () => {
  it('performs to specification', () => {
    const context = { input: input };

    tokenize(context);

    expect(context.instructions).toMatchSnapshot();
  });
});
