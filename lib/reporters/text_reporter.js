class TextReporter {
  static report(context, emphasized = [], indicated = []) {
    if(!Array.isArray(emphasized)) { emphasized = [emphasized]; }
    if(!Array.isArray(indicated)) { indicated = [indicated]; }

    const contentHeader = context.messages.reporting.contentHeader;
    const gutterHeader = context.messages.reporting.gutterHeader.padStart(5);

    const gutterWidth = gutterHeader.length + 3;
    const columnsHeader = `  ${gutterHeader} | ${contentHeader}\n`;
    const omission = `${' '.repeat(gutterWidth - 5)}...\n`;

    let snippet = context.sourceLabel ? `${context.sourceLabel}\n` : '';

    snippet += columnsHeader;

    let inOmission = false;

    for(let instruction of context.instructions) {
      const emphasize = emphasized.includes(instruction);
      const indicate = emphasize ? false : indicated.includes(instruction);
      const print = emphasize || indicate ||
      [...emphasized, ...indicated].find(emphasizedOrIndicated =>
        instruction.line >= emphasizedOrIndicated.line - 2 &&
        instruction.line <= emphasizedOrIndicated.line + 2
      );

      if(print) {
        const line = context.input.substr(instruction.index, instruction.length);
        const lineNumber = (instruction.line + context.indexing).toString();

        if(emphasize) {
          snippet += ` >${lineNumber.padStart(gutterWidth - 3)} | ${line}\n`;
        } else if(indicate) {
          snippet += ` *${lineNumber.padStart(gutterWidth - 3)} | ${line}\n`;
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
  }
}

module.exports = TextReporter;
