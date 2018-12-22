const context = require('./contextFixture.js');
const HtmlReporter = require('../../lib/reporters/html_reporter.js');

describe('HTML reporter', () => {
  it('produces html output', () => {
    context.reporter = HtmlReporter;

    const snippet = context.reporter.report(
      context,
      context.instructions[1],
      context.instructions[0]
    )

    expect(snippet).toMatchSnapshot();
  });
});
