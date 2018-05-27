const eno = require('../eno.js');

describe('Field append behaviour', () => {

  test('empty newlines are only appended between non-empty lines', () => {
    const document = eno.parse(`
      field:
      |
      | foo
      |
      | bar
      |
    `);

    expect(document.field('field')).toEqual('foo\n\nbar');
  });

  test('empty append with space instructions are always ignored', () => {
    const document = eno.parse(`
      field:
      \\
      \\ foo
      \\
      \\ bar
      \\
    `);

    expect(document.field('field')).toEqual('foo bar');
  });

});
