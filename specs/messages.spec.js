const en = require('../locale/en.js');

const locales = {
  de: require('../locale/de.js'),
  es: require('../locale/es.js')
};

describe('Translation messages', () => {
  for(let [group, messages] of Object.entries(en)) {
    for(let message of Object.keys(messages)) {
      describe(message, () => {
        for(let [locale, groups] of Object.entries(locales)) {
          test('present in `${locale}`', () => {
            expect(groups[group][message]).toBeDefined();
          });
        }
      })
    }
  }
});

// module.exports = () => {
//   for(let locale of locales) {
//     const messages = messageDictionary[locale];
//
//     const keysToUse = new Set();
//
//     for(let code of Object.keys(messages)) {
//       if(keysToUse.has(code)) {
//         throw `Locale ${locale} has a duplicate message entry for code ${code}`;
//       } else {
//         keysToUse.add(parseInt(code));
//       }
//     }
//
//     for(let [key, code] of Object.entries(errors.parser)) {
//       if(messages[code] === undefined) {
//         throw `Locale '${locale}' is missing the key errors.parser.${key}`;
//       } else {
//         keysToUse.delete(code);
//       }
//     }
//     for(let [key, code] of Object.entries(errors.validation)) {
//       if(messages[code] === undefined) {
//         throw `Locale '${locale}' is missing the key errors.validation.${key} `;
//       } else {
//         keysToUse.delete(code);
//       }
//     }
//
//     for(let [key, code] of Object.entries(strings)) {
//       if(messages[code] === undefined) {
//         throw `Locale '${locale}' is missing the key strings${key}`;
//       } else {
//         keysToUse.delete(code);
//       }
//     }
//
//     if(keysToUse.size > 0) {
//       throw `Locale ${locale} defines ${keysToUse.size} unused messages with codes ${[...keysToUse].join(', ')}`;
//     }
//
//   }
// };
