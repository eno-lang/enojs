const { EnoParseError } = require('../errors.js');
const report = require('../reporters/report.js');

// ```name: value
const ESCAPED_UNTERMINATED_NAME = /^\s*(`+)(?!`)((?:(?!\1).)+)$/;
const escapedUnterminatedName = (context, instruction, unterminated) => {
  const selectionColumn = instruction.line.lastIndexOf(unterminated)

  const message = context.messages.tokenization.escapedUnterminatedName(instruction.lineNumber);
  const snippet = report(context, instruction);
  const selection = [[instruction.lineNumber, ], [instruction.lineNumber, instruction.line.length]]

  throw new EnoParseError(message, snippet);
};

module.exports = {

  invalidLine: (context, instruction) => {
    let match;

    if( (match = ESCAPED_UNTERMINATED_NAME.exec(instruction.line)) ) {
      escapedUnterminatedName(context, instruction, match[2]);
    }

    const message = context.messages.tokenization.invalidLine(instruction.lineNumber);
    const snippet = report(context, instruction);
    const selection = [
      [instruction.lineNumber, 0],
      [instruction.lineNumber, instruction.line.length]
    ];

    throw new EnoParseError(message, snippet, selection);
  },

  unterminatedBlock: (context, instruction) => {
    const message = context.messages.tokenization.unterminatedBlock(
      instruction.name,
      instruction.lineNumber
    );

    const snippet = report(
      context,
      instruction,
      context.instructions.filter(filterInstruction => filterInstruction.lineNumber > instruction.lineNumber)
    );

    throw new EnoParseError(message, snippet);
  }

};
