const fs = require('fs');
const path = require('path');

const { parse, ParseError, ValidationError } = require('../../eno.js');

const input = fs.readFileSync(path.join(__dirname, 'du_hast.eno'), 'utf-8');

describe('Du hast', () => {
  test('succeeds', () => {
    const document = parse(input);
    expect(document.raw()).toMatchSnapshot();
  });
});
