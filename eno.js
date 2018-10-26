// const Builder = require('./lib/builder.js');
const Parser = require('./lib/parser.js');
const { EnoError, ParseError, ValidationError } = require('./lib/error_types.js');
const messages = require('./lib/messages.js');

const reporters = ['html', 'terminal', 'text']

// const build = object => {
//
//   if(typeof object !== 'object') {
//     throw new TypeError(
//       `The builder accepts only objects as input, input was: ${object}`
//     );
//   }
//
// //   const builder = new Dumper(input, locale);
// };

const parse = (input, ...optional) => {
  let options = {
    locale: 'en',
    reporter: 'text',
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

  if(!reporters.includes(options.reporter)) {
    throw new RangeError(`The requested reporter '${options.reporter}' does not exist.`);
  }

  const parser = new Parser(input, options);

  return parser.run();
};

module.exports = {
  Empty: require('./lib/elements/empty.js'),
  EnoError,
  Field: require('./lib/elements/field.js'),
  Fieldset: require('./lib/elements/fieldset.js'),
  List: require('./lib/elements/list.js'),
  ParseError,
  Section: require('./lib/elements/section.js'),
  ValidationError,
  parse
};
