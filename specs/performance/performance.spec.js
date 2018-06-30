const eno = require('../../eno.js');
const fs = require('fs');
const path = require('path');

const { performance } = require('perf_hooks');

const ITERATIONS = 10000;

const SAMPLES = {
  configuration: fs.readFileSync(path.join(__dirname, 'samples/configuration.eno'), 'utf-8'),
  content: fs.readFileSync(path.join(__dirname, 'samples/content.eno'), 'utf-8'),
  hierarchy: fs.readFileSync(path.join(__dirname, 'samples/hierarchy.eno'), 'utf-8'),
  invoice: fs.readFileSync(path.join(__dirname, 'samples/invoice.eno'), 'utf-8'),
  journey: fs.readFileSync(path.join(__dirname, 'samples/journey.eno'), 'utf-8'),
  post: fs.readFileSync(path.join(__dirname, 'samples/post.eno'), 'utf-8')
};

let analysis, reference;

describe.skip('Performance', () => {

  beforeAll(() => {
    const analysisFile = path.join(__dirname, 'analysis.json');

    if(fs.existsSync(analysisFile)) {
      analysis = JSON.parse(fs.readFileSync(analysisFile, 'utf-8'));
    } else {
      analysis = {};
    }

    reference = analysis.hasOwnProperty('reference') ? analysis.reference : null;
    analysis.modifications = { _evaluated: new Date() };
  });

  afterAll(() => {
    fs.writeFileSync(path.join(__dirname, 'analysis.json'), JSON.stringify(analysis, null, 2));
  });

  for(let [name, content] of Object.entries(SAMPLES)) {
    test(`${ITERATIONS/1000}k ${name}`, () => {
      const before = performance.now();
      for(let i = 0; i < ITERATIONS; i++)
        eno.parse(content);
      const after = performance.now();

      const duration = ((after - before) / 1000.0);
      const delta = reference ? duration - reference[name]['time'] : 0;

      let change, factor;
      if(delta >= 0) {
        factor = reference ? duration / reference[name]['time'] : 0;
        change = `${factor.toPrecision(3)}× slower / +${delta} seconds`;
      } else {
        factor = reference ? reference[name]['time'] / duration : 0;
        change = `${factor.toPrecision(3)}× faster / ${delta} seconds`;
      }

      analysis.modifications[name] = {
        change: change,
        time: duration
      };

      console.log(`${name} => ${change}`);

      expect(factor).toBeGreaterThan(0.9);
    });
  }
});
