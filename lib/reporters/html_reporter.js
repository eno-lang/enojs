const HTML_ESCAPE = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};

const escape = string => string.replace(/[&<>"'\/]/g, c => HTML_ESCAPE[c]);

class HtmlReporter {
  static line(gutter, content, ...classes) {
    let result = '';

    result += `<div class="eno-report-line ${classes.join(' ')}">`;
    result +=   `<div class="eno-report-gutter">${gutter.padStart(10)}</div>`;
    result +=   `<div class="eno-report-content">${escape(content)}</div>`;
    result += '</div>';

    return result;
  }

  static report(context, emphasized = [], indicated = []) {
    if(!Array.isArray(emphasized)) { emphasized = [emphasized]; }
    if(!Array.isArray(indicated)) { indicated = [indicated]; }

    const contentHeader = context.messages.reporting.contentHeader;
    const gutterHeader = context.messages.reporting.gutterHeader;
    const omission = HtmlReporter.line('...', '...');

    let snippet = '<pre class="eno-report">';

    if(context.sourceLabel) {
      snippet += `<div>${context.sourceLabel}</div>`;
    }

    snippet += HtmlReporter.line(gutterHeader, contentHeader);

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
        const classes = [];

        if(emphasize) {
          classes.push('eno-report-line-emphasized');
        } else if(indicate) {
          classes.push('eno-report-line-marked'); // TODO: Pick up indicated terminology
        }

        snippet += HtmlReporter.line(
          (instruction.line + context.indexing).toString(),
          context.input.substr(instruction.index, instruction.length),
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
  }
}

module.exports = HtmlReporter;
