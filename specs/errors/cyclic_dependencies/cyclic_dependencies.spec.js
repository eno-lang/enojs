const { parse } = require('../../../eno.js');

const scenarios = {

  A: `
    a < b
    - 1
    - 2

    b < a
    - 1
    - 2
  `,

  B: `
    all < one
    | all

    one < two
    | one

    two < one
    | two
  `,

  C: `
    either < or
    either = or

    or < either
    or = either
  `,

  D: `
    # one < two
    1: one

    ## three < four
    3: three

    # two < one
    2: two

    ## four < one
    4: four
  `,

  E: `
    # foo
    ## bar < foo
    # baz < foo
  `,

  F: `
    # a
    ## b
    ### c < a
  `

};

describe('Cyclic dependencies', () => {
  for(let [label, input] of Object.entries(scenarios)) {
    test(`Scenario ${label} throws`, () => {
      expect(() => parse(input)).toThrowErrorMatchingSnapshot();
    });
  }
});
