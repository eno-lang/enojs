const { parse } = require('../eno.js');

const sample = `
# default
## a
value_1: default
## b
value_1: default
value_2: default

# shallow < default
## b
value_1: shallow

# deep << default
## a
## b
value_1: deep
`;

describe('Section copy operators', () => {
  let doc;

  beforeAll(() => {
    doc = parse(sample);
  });

  describe('Default section', () => {
    it('is correctly initialized', () => {
      expect(doc.section('default').raw()).toMatchSnapshot();
    });
  });

  describe('Shallow section', () => {
    it('is correctly merged', () => {
      expect(doc.section('shallow').raw()).toMatchSnapshot();
    });
  });

  describe('Deep section', () => {
    it('is correctly merged', () => {
      expect(doc.section('deep').raw()).toMatchSnapshot();
    });
  });
});
