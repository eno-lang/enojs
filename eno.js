const Empty = require('./lib/elements/empty.js');
const { EnoError, ParseError, ValidationError } = require('./lib/error_types.js');
const Field = require('./lib/elements/field.js');
const Fieldset = require('./lib/elements/fieldset.js');
const HtmlReporter = require('./lib/reporters/html_reporter.js');
const List = require('./lib/elements/list.js');
const messages = require('./lib/messages.js');
const Parser = require('./lib/parser.js');
const Section = require('./lib/elements/section.js');
const TerminalReporter = require('./lib/reporters/terminal_reporter.js');
const TextReporter = require('./lib/reporters/text_reporter.js');


const parse = (input, ...optional) => {
  let options = {
    locale: 'en',
    reporter: TextReporter,
    sourceLabel: null,
    zeroIndexing: false
  };

  if(typeof input !== 'string') {
    throw new TypeError(
      `The parser accepts only strings as input, input was: ${input}`
    );
  }

  for(let argument of optional) {
    if(typeof argument === 'object') {
      for(let option of Object.keys(argument)) {
        const available = Object.keys(options);

        if(!available.includes(option)) {
          throw new RangeError(
            `Unknown option '${option}' supplied. Available ones are: ${available.join(', ')}`
          );
        }
      }

      Object.assign(options, argument);
    } else {
      throw new TypeError(
        `Parser options can only be an object, got: ${argument}`
      );
    }
  }

  if(!messages.hasOwnProperty(options.locale)) {
    throw new RangeError(
      `The requested locale '${options.locale}' is not available. Translation contributions are ` +
      'greatly appreciated, visit https://github.com/eno-lang/eno-locales if you wish to contribute.'
    );
  }

  options.indexing = options.zeroIndexing ? 0 : 1;
  delete options.zeroIndexing;

  options.messages = messages[options.locale];

  const parser = new Parser(input, options);

  return parser.run();
};

module.exports = {
  Empty,
  EnoError,
  Field,
  Fieldset,
  HtmlReporter,
  List,
  ParseError,
  Section,
  TerminalReporter,
  TextReporter,
  ValidationError,
  parse
};
