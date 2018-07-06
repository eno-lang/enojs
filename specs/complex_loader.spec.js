const { parse } = require('../eno.js');

const input = `
bad coordinates: Mickey Mouse
good coordinates: 48.211180, 16.371514
`.trim();

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
  const doc = parse(input);

  it('throws with bad input', () => {
    expect(() => doc.field('bad coordinates', loadCoordinates)).toThrowErrorMatchingSnapshot();
  });

  it('works with good input', () => {
    expect(doc.field('good coordinates', loadCoordinates)).toEqual({ lat: 48.211180, lng: 16.371514 });
  });
});
