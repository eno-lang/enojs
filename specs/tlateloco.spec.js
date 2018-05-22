const fs = require('fs');
const path = require('path');

const { parse } = require('../eno.js');

const input = fs.readFileSync(path.join(__dirname, './tlateloco.eno'), 'utf-8');

describe('Tlateloco sample', () => {
  test('parses correctly', () => {
    const result = parse(input);

    expect(result.raw()).toMatchSnapshot();
  });
});
