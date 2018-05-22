module.exports = (context, emphasized = [], marked = []) => {
  const contentHeader = context.messages.reporting.contentHeader;
  const gutterHeader = context.messages.reporting.gutterHeader.padStart(5);

  const gutterWidth = gutterHeader.length + 3;
  const header = `  ${gutterHeader} | ${contentHeader}\n`;
  const omission = `${' '.repeat(gutterWidth - 5)}...\n`;

  let snippet = header;

  let inOmission = false;

  for(let instruction of context.instructions) {
    const emphasize = emphasized.includes(instruction);
    const mark = marked.includes(instruction);
    let show = false;

    for(let shownInstruction of [...emphasized, ...marked]) {
      if(instruction.lineNumber >= shownInstruction.lineNumber - 2 &&
         instruction.lineNumber <= shownInstruction.lineNumber + 2) {
        show = true;
        break;
      }
    }

    if(show) {
      const lineNumber = instruction.lineNumber.toString();

      if(emphasize) {
        snippet += ` >${lineNumber.padStart(gutterWidth - 3)} | ${instruction.line}\n`;
      } else if(mark) {
        snippet += ` *${lineNumber.padStart(gutterWidth - 3)} | ${instruction.line}\n`;
      } else {
        snippet += `${lineNumber.padStart(gutterWidth - 1)} | ${instruction.line}\n`;
      }

      inOmission = false;
    } else if(!inOmission) {
      snippet += omission;
      inOmission = true;
    }
  }

  return snippet;
};
