const eno = require('../eno.js');

const sample = `
color: cyan

# notes
`.trim();

const scenarios = [
  {
    element: 'color',
    index: [3],
    zone: 'name'
  },
  {
    element: 'color',
    index: [1, 3],
    zone: 'name'
  },
  {
    element: 'color',
    index: [7],
    zone: 'value'
  },
  {
    element: 'color',
    index: [1, 7],
    zone: 'value'
  },
  {
    element: 'notes',
    index: [13],
    zone: 'sectionOperator'
  },
  {
    element: 'notes',
    index: [3, 0],
    zone: 'sectionOperator'
  },
  {
    element: 'notes',
    index: [19],
    zone: 'name'
  },
  {
    element: 'notes',
    index: [3, 6],
    zone: 'name'
  },
];

describe('Element/Token lookup', () => {
  const document = eno.parse(sample);

  for(let scenario of scenarios) {

    describe(`at (${scenario.index.join(', ')})`, () => {
      const lookup = document.lookup(...scenario.index);

      test(`looks up element '${scenario.element}'`, () => {
        expect(lookup.element.name).toEqual(scenario.element);
      });

      test(`looks up token '${scenario.zone}'`, () => {
        expect(lookup.zone).toEqual(scenario.zone);
      });
    });

  }
});
