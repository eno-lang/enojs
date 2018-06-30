module.exports = (context, emphasized = [], marked = []) => {
  const contentHeader = context.messages.reporting.contentHeader;
  const gutterHeader = context.messages.reporting.gutterHeader.padStart(5);

  const gutterWidth = gutterHeader.length + 3;
  const columnsHeader = `\x1b[1m  ${gutterHeader} | ${contentHeader}\x1b[0m\n`;
  const omission = `\x1b[1m${' '.repeat(gutterWidth - 5)}...\x1b[0m\n`;

  let snippet = '';

  if(context.sourceLabel) {
    snippet += `\x1b[1m${context.sourceLabel}\x1b[0m\n`;
  }

  snippet += columnsHeader;

  let inOmission = false;

  for(let instruction of context.instructions) {
    const emphasize = emphasized.includes(instruction);
    const mark = marked.includes(instruction);
    let show = false;

    for(let shownInstruction of [...emphasized, ...marked]) {
      if(instruction.line >= shownInstruction.line - 2 &&
         instruction.line <= shownInstruction.line + 2) {
        show = true;
        break;
      }
    }

    if(show) {
      const line = context.input.substr(instruction.index, instruction.length);
      const lineNumber = (instruction.line + context.indexing).toString();

      if(emphasize) {
        snippet += `\x1b[41m >${lineNumber.padStart(gutterWidth - 3)} | ${line}\x1b[0m\n`;
      } else if(mark) {
        snippet += `\x1b[33m *${lineNumber.padStart(gutterWidth - 3)} | ${line}\x1b[0m\n`;
      } else {
        snippet += `${lineNumber.padStart(gutterWidth - 1)} | ${line}\n`;
      }

      inOmission = false;
    } else if(!inOmission) {
      snippet += omission;
      inOmission = true;
    }
  }

  return snippet;
};
