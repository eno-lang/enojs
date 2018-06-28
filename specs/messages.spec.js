const messages = require('../lib/messages.js');

describe('Message locales (outside default en locale)', () => {
  for(let [locale, groups] of Object.entries(messages)) {
    if(locale === 'en') continue;

    describe(locale, () => {
      for(let [groupName, messages] of Object.entries(groups)) {
        describe(groupName, () => {
          if(groupName === 'elements' || groupName === 'reporting') {
            it('contains static string translations', () => {
              for(let translation of Object.values(messages)) {
                expect(typeof translation).toEqual('string');
              }
            });
          } else {
            it('contains message generator functions', () => {
              for(let generator of Object.values(messages)) {
                const result = generator();
                expect(typeof result).toEqual('string');
              }
            });
          }
        });
      }
    });
  }
});
