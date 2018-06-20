const htmlEscape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};

const escape = string => string.replace(/[&<>"'\/]/g, c => htmlEscape[c]);

const line = (gutter, content, ...classes) => {
  let result = '';

  result += `<div class="eno-report-line ${classes.join(' ')}">`;
  result +=   `<div class="eno-report-gutter">${gutter.padStart(10)}</div>`;
  result +=   `<div class="eno-report-content">${escape(content)}</div>`;
  result += '</div>';

  return result;
};

module.exports = (context, emphasized = [], marked = []) => {
  const contentHeader = context.messages.reporting.contentHeader;
  const gutterHeader = context.messages.reporting.gutterHeader;
  const omission = line('...', '...');

  let snippet = '<pre class="eno-report">';

  if(context.sourceLabel) {
    snippet += `<div>${context.sourceLabel}</div>`;
  }

  snippet += line(gutterHeader, contentHeader);

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
      const classes = [];

      if(emphasize) {
        classes.push('eno-report-line-emphasized');
      } else if(mark) {
        classes.push('eno-report-line-marked');
      }

      snippet += line(
        (instruction.lineNumber + context.indexing).toString(),
        instruction.line,
        ...classes
      );

      inOmission = false;
    } else if(!inOmission) {
      snippet += omission;
      inOmission = true;
    }
  }

  snippet += '</pre>';

  return snippet;
};
