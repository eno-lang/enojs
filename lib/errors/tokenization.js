const { ParseError } = require('../error_types.js');

// ```name: value
const UNTERMINATED_ESCAPED_NAME = /^\s*(`+)(?!`)((?:(?!\1).)+)$/;
const unterminatedEscapedName = (context, instruction, unterminated) => {
  const line = context.input.substr(instruction.index, instruction.length);
  const selectionColumn = line.lastIndexOf(unterminated);

  const message = context.messages.tokenization.unterminatedEscapedName(
    instruction.line + context.indexing
  );
  const snippet = context.reporter.report(context, instruction);

  const selection = [
    [instruction.line, selectionColumn],
    [instruction.line, instruction.length]
  ];

  return new ParseError(message, snippet, selection);
};

module.exports = {

  invalidLine: (context, instruction) => {
    const line = context.input.substr(instruction.index, instruction.length);

    let match;
    if( (match = UNTERMINATED_ESCAPED_NAME.exec(line)) ) {
      return unterminatedEscapedName(context, instruction, match[2]);
    }

    const message = context.messages.tokenization.invalidLine(
      instruction.line + context.indexing
    );

    const snippet = context.reporter.report(context, instruction);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new ParseError(message, snippet, selection);
  },

  unterminatedBlock: (context, instruction) => {
    const blockContentInstructions = context.instructions.filter(filterInstruction =>
      filterInstruction.line > instruction.line
    );

    const message = context.messages.tokenization.unterminatedBlock(
      instruction.name,
      instruction.line + context.indexing
    );

    const snippet = context.reporter.report(
      context,
      instruction,
      blockContentInstructions
    );

    const selection = [
      [instruction.line, instruction.ranges.blockOperator[0]],
      [instruction.line, instruction.ranges.name[1]]
    ];

    return new ParseError(message, snippet, selection);
  }

};
