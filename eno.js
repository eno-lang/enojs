// const EnoBuilder = require('./lib/builder.js');
const EnoParser = require('./lib/parser.js');
const { EnoError, EnoParseError, EnoValidationError } = require('./lib/errors.js');
const messages = require('./lib/messages.js');

const locales = Object.keys(messages);
const reporters = ['html', 'terminal', 'text']

// TODO: Parser and Builder (no generic dumper concept exists in eno)
// TODO: - Pass default loaders to parse(..), which are always run when getting any values from the resulting document (e.g. ERB default loader to interpolate things)
//       - Generally enable possiblity to run multiple loaders in order (then you can also pass multiple loaders to the individual getters e.g.)

// const build = object => {
//
//   if(typeof object !== 'object') {
//     throw new TypeError(
//       `The builder accepts only objects as input, input was: ${object}`
//     );
//   }
//
// //   const builder = new EnoDumper(input, locale);
// };

const parse = (input, ...optional) => {
  let options = {
    locale: 'en',
    reporter: 'text',
    sourceLabel: null
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

  if(!locales.includes(options.locale)) {
    throw new RangeError(
      `The requested locale '${options.locale}' is not available. Translation contributions are ` +
      'greatly appreciated, visit https://github.com/eno-lang/eno-locales if you wish to contribute.'
    );
  }

  options.messages = messages[options.locale];

  if(!reporters.includes(options.reporter)) {
    throw new RangeError(`The requested reporter '${options.reporter}' does not exist.`);
  }

  const parser = new EnoParser(input, options);

  return parser.run();
};

module.exports = {
  EnoDictionary: require('./lib/elements/dictionary.js'),
  EnoEmpty: require('./lib/elements/empty.js'),
  EnoError,
  EnoList: require('./lib/elements/list.js'),
  EnoParseError,
  EnoSection: require('./lib/elements/section.js'),
  EnoValidationError,
  EnoValue: require('./lib/elements/value.js'),
  parse
};
