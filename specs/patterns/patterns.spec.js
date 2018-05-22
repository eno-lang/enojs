const matcher = require('../../lib/grammar_matcher.js');
const scenarios = require('./scenarios.js');

describe('Unified grammar matcher', () => {
  for(let scenario of scenarios) {
    for(let variant of scenario.variants) {
      describe(`with "${variant}"`, () => {
        const match = matcher.GRAMMAR_REGEXP.exec(variant);

        if(scenario.captures) {
          test('matches', () => {
            expect(match).toBeTruthy();
          });

          for(let [label, index] of Object.entries(matcher)) {
            if(typeof index !== 'number') { continue; }

            const capture = scenario.captures[index];

            if(capture === undefined) {
              test(`${label} does not capture`, () => {
                expect(match[index]).toEqual(undefined);
              });
            } else {
              test(`${label} captures "${capture}"`, () => {
                expect(match[index]).toEqual(capture);
              });
            }
          }
        } else {
          test('does not match', () => {
            expect(match).toBeFalsy();
          });
        }

      });
    }
  }
});
