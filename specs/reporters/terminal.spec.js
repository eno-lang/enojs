const context = require('./contextFixture.js');
const TerminalReporter = require('../../lib/reporters/terminal_reporter.js');

describe('Terminal reporter', () => {
  it('produces colored terminal output', () => {
    context.reporter = TerminalReporter;

    const snippet = context.reporter.report(
      context,
      context.instructions[1],
      context.instructions[0]
    )

    // Uncomment this to inspect the snippet correctness in a terminal for review
    // console.log(snippet);

    expect(snippet).toMatchSnapshot();
  });
});
