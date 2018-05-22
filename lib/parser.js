const EnoSection = require('./elements/section.js');
const analyze = require('./parse_steps/analyze.js');
const resolve = require('./parse_steps/resolve.js');
const tokenize = require('./parse_steps/tokenize.js');

class EnoParser {
  constructor(input, locale, reporter) {
    const instructions = input.split(/\r?\n/).map((content, index) => {
      return {
        line: content,
        lineNumber: index + 1
      };
    });

    this.context = {
      input: input,
      instructions: instructions,
      messages: require(`../locale/${locale}.js`),
      locale: locale,
      templateIndex: {}
    };

    if(reporter) {
      this.context.reporter = reporter;
    }
  }

  run() {
    tokenize(this.context);
    analyze(this.context);
    resolve(this.context);

    this.context.document = new EnoSection(this.context, this.context.documentInstruction, null);

    return this.context.document;
  }
}

module.exports = EnoParser;
