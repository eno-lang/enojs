const { inspectTokenization } = require('./util.js');

const input = `
\`name\` < template

\`\`na\`me\`\` < template

\`\`\`na\`\`me\`\`\`    < template

    \`\` \`name\` \`\`    < template

\`name\` < template
`.trim();

describe('Escaped copy tokenization', () => {
  it('performs to specification', () => {
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
