const { parse } = require('../eno.js');

const sample = `
empty:
leer:

-

-

-

nichts:
nada:

# nothing
## none
void:
emptyness:
-- leere
-- leere

# ningun
absence:
-

-
-


non:
end:
`;

describe('Empty elements', () => {
  it('correctly parses', () => {
    const doc = parse(sample);
    expect(doc.raw()).toMatchSnapshot();
  });
});
