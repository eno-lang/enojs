const { EnoParseError } = require('../error_types.js');
const report = require('../reporters/report.js');

// ```name: value
const UNTERMINATED_ESCAPED_NAME = /^\s*(`+)(?!`)((?:(?!\1).)+)$/;
const unterminatedEscapedName = (context, instruction, unterminated) => {
  const selectionColumn = instruction.line.lastIndexOf(unterminated);

  const message = context.messages.tokenization.unterminatedEscapedName(
    instruction.lineNumber + context.indexing
  );
  const snippet = report(context, instruction);

  const selection = [
    [instruction.lineNumber, selectionColumn],
    [instruction.lineNumber, instruction.line.length]
  ];

  return new EnoParseError(message, snippet, selection);
};

module.exports = {

  invalidLine: (context, instruction) => {
    let match;
    if( (match = UNTERMINATED_ESCAPED_NAME.exec(instruction.line)) ) {
      return unterminatedEscapedName(context, instruction, match[2]);
    }

    const message = context.messages.tokenization.invalidLine(
      instruction.lineNumber + context.indexing
    );

    const snippet = report(context, instruction);

    const selection = [
      [instruction.lineNumber, 0],
      [instruction.lineNumber, instruction.line.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  unterminatedBlock: (context, instruction) => {
    const blockContentInstructions = context.instructions.filter(filterInstruction =>
      filterInstruction.lineNumber > instruction.lineNumber
    );

    const message = context.messages.tokenization.unterminatedBlock(
      instruction.name,
      instruction.lineNumber + context.indexing
    );

    const snippet = report(
      context,
      instruction,
      blockContentInstructions
    );

    const selection = [
      [instruction.lineNumber, instruction.ranges.blockOperator[0]],
      [instruction.lineNumber, instruction.ranges.name[1]]
    ];

    return new EnoParseError(message, snippet, selection);
  }

};
