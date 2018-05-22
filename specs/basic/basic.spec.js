const fs = require('fs');
const path = require('path');

const { parse, EnoParseError, EnoValidationError } = require('../../eno.js');

const input = fs.readFileSync(path.join(__dirname, 'basic.eno'), 'utf-8');

describe('A basic testrun', () => {
  test('succeeds', () => {
    const document = parse(input);

    expect(document.raw()).toMatchSnapshot();
  });
});
