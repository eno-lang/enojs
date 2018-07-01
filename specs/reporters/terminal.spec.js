const context = require('./contextFixture.js');
const report = require('../../lib/reporters/report.js');

describe('Terminal reporter', () => {
  it('produces colored terminal output', () => {
    context.reporter = 'terminal';

    const snippet = report(
      context,
      context.instructions[1],
      context.instructions[0]
    )

    // Uncomment this to inspect the snippet correctness in a terminal for review
    // console.log(snippet);

    expect(snippet).toMatchSnapshot();
  });
});
