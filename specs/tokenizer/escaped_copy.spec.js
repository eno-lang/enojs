const tokenize = require('../../lib/parse_steps/tokenize.js');

const input = `
\`name\` < template

\`\`na\`me\`\` < template

\`\`\`na\`\`me\`\`\`    < template

    \`\` \`name\` \`\`    < template

\`name\` < template
`.trim();

describe('Escaped copy tokenization', () => {
  it('performs to specification', () => {
    const context = { input: input };

    tokenize(context);

    expect(context.instructions).toMatchSnapshot();
  });
});
