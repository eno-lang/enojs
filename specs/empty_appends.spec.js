const { parse } = require('../eno.js');

const presentScenarios = {

  A: `
    field:
    | present
    \\
    |
    \\
    |
  `,

  B: `
    field:
    \\
    |
    \\
    | present
  `,

  C: `
    field:
    \\
    |
    \\ present
    |
    \\
  `
};

const emptyScenarios = {

  D: `
    field:
    |
  `,

  E: `
    field:
    \\
  `,

  F: `
    field:
    \\
    |
  `

};

describe('Empty appends to a field', () => {
  for(let [label, input] of Object.entries(presentScenarios)) {
    test(`Scenario ${label} yields a value`, () => {
      expect(parse(input).field('field')).toEqual('present');
    });
  }

  for(let [label, input] of Object.entries(emptyScenarios)) {
    test(`Scenario ${label} yields null`, () => {
      expect(parse(input).field('field')).toEqual(null);
    });
  }
});
