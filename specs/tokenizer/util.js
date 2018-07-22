const tokenize = require('../../lib/parse_steps/tokenize.js');

exports.inspectTokenization = input => {
  const context = { input: input };

  tokenize(context);

  return context.instructions;
};
