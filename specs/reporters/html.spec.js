const context = require('./contextFixture.js');
const report = require('../../lib/reporters/report.js');

describe('HTML reporter', () => {
  it('produces html output', () => {
    context.reporter = 'html';

    const snippet = report(
      context,
      context.instructions[1],
      context.instructions[0]
    )

    expect(snippet).toMatchSnapshot();
  });
});
