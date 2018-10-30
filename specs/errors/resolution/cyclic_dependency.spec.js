const eno = require('../../../eno.js');

const scenarios = {

  A: {
    input: `
a < b
- 1
- 2

b < a
- 1
- 2
    `.trim(),
    selection: [[5, 4], [5, 5]]
  },

  B: {
    input: `
all < one
| all

one < two
| one

two < one
| two
    `.trim(),
    selection: [[7, 6], [7, 9]]
  },

  C: {
    input: `
either < or
either = or

or < either
or = either
    `.trim(),
    selection: [[4, 5], [4, 11]]
  },

  D: {
    input: `
# one < two
1: one

## three < four
3: three

# two < one
2: two

## four < one
4: four
    `.trim(),
    selection: [[10, 10], [10, 13]]
  },

  E: {
    input: `
# foo
## bar < foo
# baz < foo
    `.trim(),
    selection: [[2, 9], [2, 12]]
  },

  F: {
    input: `
# a
## b
### c < a
    `.trim(),
    selection: [[3, 8], [3, 9]]
  }
};

describe('resolution.cyclicDependency', () => {
  for(let [label, scenario] of Object.entries(scenarios)) {
    describe(`in scenario ${label}`, () => {

      let error;

      beforeAll(() => {
        try {
          eno.parse(scenario.input);
        } catch(err) {
          error = err;
        }
      });

      it(`returns the correct message`, () => {
        expect(error.message).toMatchSnapshot();
      });

      it(`returns the correct selection`, () => {
        expect(error.selection).toMatchSnapshot();
      });
    })
  }
});
