const { inspectTokenization } = require('./util.js');

const input = `
# \`name\`

## \`\`na\`me\`\`

### \`\`\`na\`\`me\`\`\`

    #### \`\` \`name\` \`\`

# \`name\`
`.trim();

describe('Escaped section tokenization', () => {
  it('performs to specification', () => {
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
