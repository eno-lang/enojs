const { parse } = require('../eno.js');

const sample = `
bad coordinates: Mickey Mouse
good coordinates: 48.211180, 16.371514
`;

const loadCoordinates = ({ name, value }) => {
  const split = value.split(',');

  if(split.length < 2) {
    throw `${name} should have a lat and a lng!`;
  }

  return {
    lat: parseFloat(split[0]),
    lng: parseFloat(split[1])
  };
};

describe('Complex loader', () => {
  const doc = parse(sample);

  test('throws with bad input', () => {
    expect(() => doc.field('bad coordinates', loadCoordinates)).toThrowErrorMatchingSnapshot();
  });

  test('works with good input', () => {
    expect(doc.field('good coordinates', loadCoordinates)).toEqual({ lat: 48.211180, lng: 16.371514 });
  });
});
